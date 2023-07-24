import { fromFileUrl, resolve } from "std/path/mod.ts";
import { extract } from "std/front_matter/any.ts";
import { existsSync } from "std/fs/exists.ts";
import { renderToString } from "preact-render-to-string";
import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild_deno_loader";
import { consume, defineConfig, install, stringify, tw } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";

import { page } from "./page.tsx";
import { get_route_map, resolve_file } from "./route_map.ts";
import type { Config, Magic, PluginResult } from "./types.ts";
import { getHeaderElements } from "../utils.ts";

install(defineConfig({
  presets: [presetTailwind()],
}));

function applyTwind(html: string) {
  // Apply twind
  const restore = tw.snapshot();
  const markup = consume(html);
  const css = stringify(tw.target);
  restore();

  return markup.replace("</head>", `<style data-twind>${css}</style></head>`);
}

export async function render(
  config: Config,
  magic: Magic,
  path: string,
  plugins: PluginResult[],
  dev = false,
) {
  const base_path = resolve("pages", path);
  const [file_type, markdown] = resolve_file(base_path);

  if (file_type === "tsx") {
    const indexPath = base_path + "/index.tsx";
    const entrypoint = existsSync(indexPath) ? indexPath : base_path + ".tsx";

    const result = await esbuild.build({
      plugins: [...denoPlugins({
        configPath: fromFileUrl(import.meta.resolve("../../deno.jsonc")),
      })],
      entryPoints: [entrypoint],
      bundle: true,
      write: false,
      format: "esm",
      jsxImportSource: "preact",
      jsx: "automatic",
    });
    const file = new TextDecoder().decode(result.outputFiles[0].contents);

    const { default: userPage, config } = await import(
      "data:text/javascript;base64," + btoa(file)
    );

    return applyTwind(
      "<!DOCTYPE html>\n" + renderToString(
        await page({
          page: { title: config.title, description: config.description },
          options: {
            config,
            dev,
            body: renderToString(await userPage()),
          },
        }),
      ),
    );
  }

  const frontmatter = extract(markdown);
  const route_map = get_route_map(resolve("pages"), true);

  const title = frontmatter.attrs.title as string ?? "No Title";
  const description = frontmatter.attrs.description as string ??
    "No Description";

  const html = "<!DOCTYPE html>\n" + renderToString(
    await page({
      page: { title, description },
      options: {
        markdown,
        route_map,
        route: "/" + path,
        config,
        magic,
        file_type,
        dev,
        header: getHeaderElements(plugins),
      },
    }),
  );

  return applyTwind(html);
}
