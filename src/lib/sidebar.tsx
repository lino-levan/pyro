import { ChevronDown } from "../../deps.ts";
import type { RouteMap } from "./types.ts";
import { global_route_map } from "./route_map.ts";
import { readConfig } from "../utils.tsx";

function simplify(url: string) {
  return url.replaceAll("/", "").replaceAll("-", "");
}

export function Sidebar(
  props: { route_map?: RouteMap[]; class: string; route: string },
) {
  const config = readConfig();
  const route_map = props.route_map ?? global_route_map;
  return (
    <div class={props.class}>
      {(!props.route_map && props.route === "_PYRO_SHOW_LOGO") && (
        <a href="/">
          <h1 class="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2 mr-4">
            <img src="/icon.png" class="w-8 h-8" />
            {config.title}
          </h1>
        </a>
      )}
      {route_map.map((route) => (
        <>
          {route.sub_route_map
            ? (
              <details
                class={`group/${simplify(route.url)} select-none`}
                open={true}
              >
                <summary class="flex justify-between items-center rounded pl-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all">
                  <a
                    href={route.url}
                    class="font-medium text-gray-700 dark:text-gray-200"
                  >
                    {route.title}
                  </a>
                  <ChevronDown
                    class={`-rotate-90 group-open/${
                      simplify(route.url)
                    }:rotate-0 transition-all cursor-pointer`}
                  />
                </summary>
                <Sidebar
                  class="pl-4 w-full flex flex-col gap-2 pt-2"
                  route_map={route.sub_route_map}
                  route={props.route}
                />
              </details>
            )
            : (
              <a
                href={route.url}
                class="flex justify-between items-center rounded px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
              >
                {route.title}
                {route.sub_route_map && <ChevronDown />}
              </a>
            )}
        </>
      ))}
    </div>
  );
}
