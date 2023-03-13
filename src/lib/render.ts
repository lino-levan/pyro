import { resolve } from "std/path/mod.ts";
import { extract } from "std/encoding/front_matter/any.ts";
import { renderToString } from "preact-render-to-string";
import { page } from "./page.tsx";
import { get_route_map, resolve_file } from "./route_map.ts";
import type { Config, Magic } from "./types.ts";

import "https://esm.sh/prismjs@1.29.0/components/prism-json?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-yaml?no-check";

export async function render(config: Config, magic: Magic, path: string) {
  const markdown = resolve_file(resolve("pages", path));
  const frontmatter = extract(markdown);
  const route_map = get_route_map(resolve("pages"), true);

  const title = frontmatter.attrs.title as string ?? "No Title";
  const description = frontmatter.attrs.description as string ??
    "No Description";

  return "<!DOCTYPE html>\n" + renderToString(
    await page({
      page: { title, description },
      markdown,
      route_map,
      route: "/" + path,
      config,
      magic,
    }),
  );
}
