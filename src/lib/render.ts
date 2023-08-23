import {
  createGenerator,
  existsSync,
  extract,
  join,
  presetUno,
  renderToString,
  resolve,
} from "../../deps.ts";

import { Footer, Header, page } from "./page.tsx";
import { get_route_map, resolve_file } from "./route_map.ts";
import type { Config, Magic, PluginResult } from "./types.ts";
import { getHeaderElements, importBuild } from "../utils.tsx";

const unoConfig = existsSync("./uno.config.ts")
  ? (await importBuild("./uno.config.ts")).default
  : {
    presets: [
      presetUno({
        dark: "media",
      }),
    ],
  };

const uno = createGenerator(unoConfig);

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

    const { default: userPage, config: userConfig } = await importBuild(
      entrypoint,
    );

    return await applyUno(
      "<!DOCTYPE html>\n" + renderToString(
        await page({
          page: { title: config.title, description: userConfig.description },
          options: {
            route: "/" + path,
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
  const hide_navbar = frontmatter.attrs.hide_navbar
    ? !!frontmatter.attrs.hide_navbar
    : undefined;

  const html = "<!DOCTYPE html>\n" + renderToString(
    await page({
      page: { title, description, hide_navbar },
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
