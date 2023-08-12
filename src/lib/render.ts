import { fromFileUrl, join, resolve, toFileUrl } from "std/path/mod.ts";
import { extract } from "std/front_matter/any.ts";
import { existsSync } from "std/fs/exists.ts";
import { renderToString } from "preact-render-to-string";
import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild_deno_loader";

import { Footer, Header, page } from "./page.tsx";
import { get_route_map, resolve_file } from "./route_map.ts";
import type { Config, Magic, PluginResult } from "./types.ts";
import { getHeaderElements } from "../utils.tsx";

import { createGenerator } from "@unocss/core";
import { presetUno } from "@unocss/preset-uno";

const uno = createGenerator({
  presets: [
    presetUno({
      dark: "media",
    }),
  ],
});

async function applyUno(html: string) {
  // Apply uno
  const warn = console.warn;
  console.warn = () => {};
  const { css } = await uno.generate(html);
  html = html.replace("</head>", `<style>${css}</style></head>`);
  console.warn = warn;
  return html;
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
    const indexPath = join(base_path, "index.tsx");
    const entrypoint = existsSync(indexPath) ? indexPath : base_path + ".tsx";

    let configPath = import.meta.resolve("../../deno.jsonc");

    if (configPath.startsWith("file:")) {
      configPath = fromFileUrl(configPath);
    }

    const result = await esbuild.build({
      plugins: [...denoPlugins({
        configPath,
      })],
      entryPoints: [toFileUrl(entrypoint).href],
      bundle: true,
      write: false,
      format: "esm",
      jsxImportSource: "preact",
      jsx: "automatic",
    });
    const file = new TextDecoder().decode(result.outputFiles[0].contents);

    const { default: userPage, config: userConfig } = await import(
      "data:text/javascript;base64," + btoa(file)
    );

    return await applyUno(
      "<!DOCTYPE html>\n" + renderToString(
        await page({
          page: { title: config.title, description: userConfig.description },
          options: {
            config,
            dev,
            magic,
            body: renderToString(
              await userPage({
                header: Header({
                  title: config.title,
                  header: getHeaderElements(config, plugins),
                  github: config.github,
                }),
                footer: config.footer
                  ? Footer({
                    copyright: config.copyright,
                    github: config.github,
                    footer: config.footer,
                  })
                  : undefined,
              }),
            ),
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
        header: getHeaderElements(config, plugins),
      },
    }),
  );

  return await applyUno(html);
}
