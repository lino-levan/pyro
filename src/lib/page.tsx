import type { Config, FileTypes, Magic, RouteMap } from "./types.ts";
import Github from "icons/brand-github.tsx";
import ExternalLink from "icons/external-link.tsx";
import { renderMD, renderMDX } from "../utils.ts";
import { Sidebar } from "./sidebar.tsx";

export async function page(props: {
  page: {
    title: string;
    description: string;
  };
  options: {
    markdown: string;
    route_map: RouteMap[];
    route: string;
    config: Config;
    magic: Magic;
    file_type: FileTypes;
  };
}) {
  return (
    <html lang="en">
      <head>
        <title>{props.page.title} | {props.options.config.title}</title>
        <link rel="stylesheet" href="/bundle.css" />
        <meta name="description" content={props.page.description} />
        <link rel="icon" type="image/png" href="/icon.png" />
      </head>
      <body
        class="flex flex-col min-h-screen"
        style={{ backgroundColor: props.options.magic.background }}
      >
        <header class="w-full h-16 shadow-sm flex items-center px-4 justify-between bg-white z-10">
          <h1 class="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <image src="/icon.png" class="w-8 h-8" />
            {props.options.config.title}
          </h1>
          <div class="flex items-center">
            {props.options.config.github && (
              <a target="_blank" href={props.options.config.github}>
                <Github />
              </a>
            )}
          </div>
        </header>
        <div class="flex gap-4 flex-grow bg-white">
          <Sidebar
            class="w-64 p-2 border-r border-gray-200 pt-4 flex flex-col gap-2"
            route_map={props.options.route_map}
            route={props.options.route}
          />
          <div class="flex-grow max-w-screen-lg flex flex-col gap-8 py-4 overflow-hidden">
            <h1 class="text-5xl font-bold text-gray-800">
              {props.page.title}
            </h1>
            {props.options.file_type === "md"
              ? (
                <div
                  class="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: await renderMD(props.options.markdown),
                  }}
                />
              )
              : (
                <div class="markdown-body">
                  {await renderMDX(props.options.markdown)}
                </div>
              )}
          </div>
        </div>
        {props.options.config.footer && (
          <footer class="px-4 py-12 w-full flex justify-center text-gray-800 border-t bg-white">
            <div class="max-w-screen-lg w-full flex flex-wrap justify-around">
              <image src="/icon.png" class="w-8 h-8" />
              {Object.entries(props.options.config.footer).map((
                [name, value],
              ) => (
                <div>
                  <p class="font-bold pb-4">{name}</p>
                  <ul class="flex flex-col gap-2">
                    {value.map((value) => (
                      <li>
                        <a
                          class="flex items-center gap-1 hover:underline"
                          href={value.split(" ").pop()}
                        >
                          {value.split(" ").slice(0, -1).join(" ")}
                          {!value.split(" ").pop()!.startsWith("/") && (
                            <ExternalLink class="inline w-4" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div class="h-full flex flex-col justify-around">
                {props.options.config.copyright && (
                  <p class="whitespace-pre text-gray-500 text-sm">
                    {props.options.config.copyright}
                  </p>
                )}
                <div>
                  {props.options.config.github && (
                    <a
                      target="_blank"
                      class="w-min"
                      href={props.options.config.github}
                    >
                      <Github class="text-gray-500 hover:text-gray-900" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}
