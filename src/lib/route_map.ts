import { join, resolve } from "std/path/mod.ts";
import { extract } from "std/encoding/front_matter/any.ts";

export interface RouteMap {
  title: string;
  url: string;
  index: number;
  sub_route_map?: RouteMap[];
}

export function resolve_file(path: string) {
  try {
    return Deno.readTextFileSync(resolve(path + ".md"));
  } catch {
    return Deno.readTextFileSync(resolve(path, "index.md"));
  }
}

export function get_route_map(directory: string, top_level = false) {
  const route_map: RouteMap[] = [];

  for (const entry of Deno.readDirSync(directory)) {
    const markdown = resolve_file(join(directory, entry.name.split(".")[0]));
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
