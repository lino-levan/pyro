import {
  denoPlugins,
  esbuild,
  existsSync,
  rehypeStringify,
  remarkGfm,
  remarkParse,
  remarkRehype,
  resolve,
  toFileUrl,
  unified,
} from "../deps.ts";
import { rehypeStarryNight } from "./lib/rehype_starry_night.ts";
import type {
  Config,
  FileTypes,
  JSX,
  Plugin,
  PluginResult,
} from "./lib/types.ts";

/**
 * Read a file and return the file type and the file content
 */
export function readFileSync(...options: string[]): [FileTypes, string] {
  if (options.length === 1) {
    return [
      options[0].split(".").pop() as FileTypes,
      Deno.readTextFileSync(options[0]),
    ];
  }
  try {
    return [
      options[0].split(".").pop() as FileTypes,
      Deno.readTextFileSync(options[0]),
    ];
  } catch {
    options.shift();
    return readFileSync(...options);
  }
}

function removeFrontmatter(markdown: string) {
  return markdown.replace(/^---.+?---/s, "");
}

/**
 * Render Markdown to HTML
 */
export async function renderMD(data: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(removeFrontmatter(data));

  return String(file);
}

/**
 * Loads all the provided plugins
 */
export function loadPlugins(plugins: string[]) {
  return Promise.all(
    plugins.map(async (plugin) => ((await import(plugin)).default as Plugin)()),
  );
}

/**
 * Get the header elements from the config and plugins
 */
export function getHeaderElements(config: Config, plugins: PluginResult[]) {
  const header: {
    left: JSX.Element[];
    right: JSX.Element[];
  } = {
    left: config.header?.left?.map((value) => (
      <a
        class="hover:text-gray-500 dark:hover:text-gray-400"
        href={value.split(" ").pop()}
      >
        {value.split(" ").slice(0, -1).join(" ")}
      </a>
    )) ?? [],
    right: config.header?.right?.map((value) => (
      <a
        class="hover:text-gray-500 dark:hover:text-gray-400"
        href={value.split(" ").pop()}
      >
        {value.split(" ").slice(0, -1).join(" ")}
      </a>
    )) ?? [],
  };

  for (const plugin of plugins) {
    if (!plugin.header) continue;
    if (plugin.header.left) {
      header.left = [...header.left, plugin.header.left];
    }
    if (plugin.header.right) {
      header.right = [...header.right, plugin.header.right];
    }
  }

  return header;
}

export async function importBuild(entrypoint: string) {
  entrypoint = resolve(entrypoint);

  let configPath: string | undefined = undefined;

  if (existsSync("./deno.json")) {
    configPath = resolve("./deno.json");
  } else if (existsSync("./deno.jsonc")) {
    configPath = resolve("./deno.jsonc");
  }

  const result = await esbuild.build({
    plugins: [...denoPlugins({ configPath })],
    entryPoints: [toFileUrl(entrypoint).href],
    bundle: true,
    write: false,
    format: "esm",
    jsxImportSource: "https://esm.sh/preact@10.17.0",
    jsx: "automatic",
  });
  const file = new TextDecoder().decode(result.outputFiles[0].contents);

  return await import(
    "data:text/javascript;base64," + btoa(file)
  );
}
