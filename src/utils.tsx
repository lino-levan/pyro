import { compile, rehypeHighlight, remarkGfm, render } from "../deps.ts";
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
 * Render MDX to HTML
 */
export async function renderMDX(data: string) {
  const compiled = (await compile(removeFrontmatter(data), {
    jsxImportSource: "https://esm.sh/preact@10.16.0",
    outputFormat: "program",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  })).value;

  const mdx = await import("data:text/javascript," + compiled);

  return mdx.default();
}

/**
 * Render Markdown to HTML
 */
// deno-lint-ignore require-await
export async function renderMD(data: string) {
  return render(removeFrontmatter(data), {
    disableHtmlSanitization: true,
  });
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
