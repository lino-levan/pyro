import type { Config, FileTypes, JSX, Magic, RouteMap } from "./types.ts";
import { ExternalLink, Github, IconMenu2, posix } from "../../deps.ts";
import { renderMD } from "../utils.tsx";
import { Sidebar } from "./sidebar.tsx";

export function Header(props: {
  title: string;
  header: {
    left: JSX.Element[];
    right: JSX.Element[];
  };
  github?: string;
}) {
  return (
    <header class="w-full h-16 shadow-sm flex gap-4 items-center px-4 bg-white dark:bg-black text-gray-800 dark:text-gray-200 z-10">
      <details class="sm:hidden">
        <summary class="text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300">
          <IconMenu2 />
        </summary>
        <div class="bg-white dark:bg-black absolute top-0 left-0 h-screen">
          <Sidebar
            class="w-64 p-2 border-r border-gray-200 dark:border-gray-700 pt-4 flex flex-col gap-2"
            route="_PYRO_SHOW_LOGO"
          />
        </div>
      </details>
      <a href="/">
        <h1 class="font-semibold text-lg text-gray-800 flex items-center gap-2 dark:text-gray-200 mr-4">
          <img src="/icon.png" class="w-8 h-8" />
          {props.title}
        </h1>
      </a>
      {props.header.left}
      <div class="flex gap-4 items-center ml-auto text-gray-100">
        {props.header.right}
        {props.github && (
          <a
            target="_blank"
            class="text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
            href={props.github}
          >
            <Github />
          </a>
        )}
      </div>
    </header>
  );
}

export function Footer(
  props: {
    copyright?: string;
    footer: Record<string, string[]>;
    github?: string;
  },
) {
  return (
    <footer class="px-4 py-12 w-full flex justify-center text-gray-800 dark:text-gray-200 border-t dark:border-gray-700 bg-white dark:bg-black">
      <div class="max-w-screen-lg w-full flex flex-col sm:flex-row flex-wrap justify-around">
        <image src="/icon.png" class="w-8 h-8" />
        {Object.entries(props.footer).map((
          [name, value],
        ) => (
          <div class="py-4 sm:py-0">
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
        <div class="py-4 sm:h-full flex flex-row-reverse sm:flex-col justify-around">
          {props.copyright && (
            <p class="whitespace-pre text-gray-500 dark:text-gray-400 text-sm">
              {props.copyright}
            </p>
          )}
          <div>
            {props.github && (
              <a
                target="_blank"
                class="w-min"
                href={props.github}
              >
                <Github class="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export async function page(props: {
  page: {
    title: string;
    description: string;
    hide_navbar?: boolean;
  };
  options: {
    markdown: string;
    route: string;
    config: Config;
    magic: Magic;
    file_type: FileTypes;
    dev: boolean;
    header: {
      left: JSX.Element[];
      right: JSX.Element[];
    };
  } | {
    route: string;
    config: Config;
    body: string;
    dev: boolean;
    magic: Magic;
  };
}) {
  const hide_navbar = props.page.hide_navbar ??
    props.options.config.hide_navbar ?? false;

  return (
    <html lang="en">
      <head>
        <title>{props.page.title} | {props.options.config.title}</title>
        <link rel="stylesheet" href="/_pyro/bundle.css" />
        <meta name="description" content={props.page.description} />
        <meta name="viewport" content="width=device-width" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="og:title"
          content={`${props.page.title} | ${props.options.config.title}`}
        />
        <meta name="og:description" content={props.page.description} />
        {props.options.config.base && !props.options.dev && (
          <meta
            name="og:image"
            content={new URL(
              posix.join(props.options.route, "embed.png"),
              props.options.config.base,
            ).href}
          />
        )}
        <meta name="theme-color" content={props.options.magic.background} />
        <link rel="icon" type="image/png" href="/icon.png" />
        {props.options.dev && <script src="/_pyro/reload.js" />}
      </head>
      {"body" in props.options
        ? (
          <body
            style={{ backgroundColor: props.options.magic.background }}
            dangerouslySetInnerHTML={{ __html: props.options.body }}
          />
        )
        : (
          <body
            class="flex flex-col min-h-screen dark:text-gray-200"
            style={{ backgroundColor: props.options.magic.background }}
          >
            <Header
              title={props.options.config.title}
              header={props.options.header}
              github={props.options.config.github}
            />
            <div
              class={`flex gap-12 flex-grow bg-white dark:bg-black ${
                hide_navbar ? "justify-center" : ""
              }`}
            >
              {!hide_navbar && (
                <Sidebar
                  class="w-64 p-2 border-r border-gray-200 dark:border-gray-700 pt-4 hidden sm:flex flex-col gap-2"
                  route={props.options.route}
                />
              )}
              <div class="flex-grow max-w-screen-lg flex flex-col gap-8 py-4 px-4 overflow-hidden">
                <h1 class="text-5xl font-bold text-gray-800 dark:text-gray-100">
                  {props.page.title}
                </h1>
                <div
                  class="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: await renderMD(props.options.markdown),
                  }}
                />
              </div>
            </div>
            {props.options.config.footer && (
              <Footer
                copyright={props.options.config.copyright}
                github={props.options.config.github}
                footer={props.options.config.footer}
              />
            )}
          </body>
        )}
    </html>
  );
}
