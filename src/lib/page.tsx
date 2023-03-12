import { CSS, KATEX_CSS, render } from "gfm";
import type { RouteMap } from "./route_map.ts";
import ChevronDown from "icons/chevron-down.tsx";
import Github from "icons/brand-github.tsx";
import type { Config } from "./types.ts";

function simplify(url: string) {
  return url.replaceAll("/", "").replaceAll("-", "");
}

function Sidebar(
  props: { route_map: RouteMap[]; class: string; route: string },
) {
  return (
    <div class={props.class}>
      {props.route_map.map((route) => (
        <>
          {route.sub_route_map
            ? (
              <details
                class={`group/${simplify(route.url)} select-none`}
                open={true}
              >
                <summary
                  class={`flex justify-between items-center rounded pl-4 py-1 hover:bg-gray-100 transition-all ${
                    props.route === route.url ? "bg-gray-100" : ""
                  }`}
                >
                  <a
                    href={route.url}
                    class="font-medium text-gray-700"
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
                class={`flex justify-between items-center rounded px-4 py-1 hover:bg-gray-100 transition-all ${
                  props.route === route.url ? "bg-gray-100" : ""
                }`}
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

export function page(options: {
  page: {
    title: string;
    description: string;
  };
  markdown: string;
  route_map: RouteMap[];
  route: string;
  config: Config;
}) {
  return (
    <html lang="en">
      <head>
        <title>{options.page.title} | {options.config.title}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: CSS + KATEX_CSS + `.markdown-body ul {
            list-style: disc
          }
          .markdown-body ol {
            list-style: numeric
          }
          .markdown-body table {
            width: fit-content;
          }

          details > summary {
            list-style: none;
          }
          details > summary::marker,
          details > summary::-webkit-details-marker {
            display: none;
          }
          `,
          }}
        />
        <script src="https://cdn.twind.style" />
        <meta name="description" content={options.page.description} />
        <link rel="icon" type="image/png" href="/icon.png" />
      </head>
      <body class="flex flex-col">
        <header class="w-full h-16 shadow-sm flex items-center px-4 justify-between">
          <h1 class="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <image src="/icon.png" class="w-8 h-8" />
            {options.config.title}
          </h1>
          <div class="flex items-center">
            {options.config.github && (
              <a target="_blank" href={options.config.github}>
                <Github />
              </a>
            )}
          </div>
        </header>
        <div class="flex gap-4 flex-grow">
          <Sidebar
            class="w-64 p-2 border-r border-gray-200 pt-4 flex flex-col gap-2"
            route_map={options.route_map}
            route={options.route}
          />
          <div class="flex-grow max-w-screen-lg flex flex-col gap-8 py-4 overflow-hidden">
            <h1 class="text-5xl font-bold text-gray-800">
              {options.page.title}
            </h1>
            <div
              class="markdown-body"
              dangerouslySetInnerHTML={{
                __html: render(options.markdown.replace(/^---.+?---/s, ""), {
                  disableHtmlSanitization: true,
                }),
              }}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
