import { resolve } from "std/path/mod.ts";
import { extract } from "std/encoding/front_matter/any.ts";
import { renderToString } from "preact-render-to-string";
import { page } from "./page.tsx";
import { get_route_map, resolve_file } from "./route_map.ts";
import type { Config, Magic } from "./types.ts";

import {
  consume,
  defineConfig,
  install,
  stringify,
  tw,
} from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";

install(defineConfig({
  presets: [presetTailwind()],
}));

export async function render(
  config: Config,
  magic: Magic,
  path: string,
  dev = false,
) {
  const [file_type, markdown] = resolve_file(resolve("pages", path));
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
      },
    }),
  );

  // Apply twind
  const restore = tw.snapshot();
  const markup = consume(html);
  const css = stringify(tw.target);
  restore();

  return markup.replace("</head>", `<style data-twind>${css}</style></head>`);
}
