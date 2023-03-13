import { join, resolve } from "std/path/mod.ts";
import { extract } from "std/encoding/front_matter/any.ts";
import { readFileSync } from "../utils.ts";
import type { RouteMap } from "./types.ts";

export function resolve_file(path: string) {
  return readFileSync(
    resolve(path + ".md"),
    resolve(path + ".mdx"),
    resolve(path, "index.md"),
    resolve(path, "index.mdx"),
  );
}

export function get_route_map(directory: string, top_level = false) {
  const route_map: RouteMap[] = [];

  for (const entry of Deno.readDirSync(directory)) {
    const [_, markdown] = resolve_file(
      join(directory, entry.name.split(".")[0]),
    );
    const frontmatter = extract(markdown);
    const extracted = resolve(directory, entry.name).match(
      /(?:.+?\/pages(.+)\.)|(?:.+?\/pages(.+))/,
    )!;
    const url = extracted[1] || extracted[2];

    if (url.includes("index") && !top_level) {
      continue;
    }

    const route: RouteMap = {
      title: frontmatter.attrs.title as string,
      url: url.replace("index", ""),
      index: frontmatter.attrs.index as number ?? 0,
    };

    // console.log(route)

    if (entry.isDirectory) {
      route.sub_route_map = get_route_map(join(directory, entry.name));
    }

    route_map.push(route);
  }

  route_map.sort((a, b) => a.index - b.index);

  return route_map;
}
