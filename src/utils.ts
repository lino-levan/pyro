import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-prism";
import { compile } from "mdx";
import { render } from "gfm";
import type { FileTypes, JSX, Plugin, PluginResult } from "./lib/types.ts";

import "prism/components/prism-markdown?no-check";
import "prism/components/prism-jsx?no-check";
import "prism/components/prism-python?no-check";
import "prism/components/prism-typescript?no-check";
import "prism/components/prism-json?no-check";
import "prism/components/prism-bash?no-check";
import "prism/components/prism-yaml?no-check";

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

export async function renderMDX(data: string) {
  const compiled = (await compile(removeFrontmatter(data), {
    jsxImportSource: "preact",
    outputFormat: "program",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  })).value;

  const mdx = await import("data:text/javascript," + compiled);

  return mdx.default();
}

// deno-lint-ignore require-await
export async function renderMD(data: string) {
  return render(removeFrontmatter(data), {
    disableHtmlSanitization: true,
  });
}

export function loadPlugins(plugins: string[]) {
  return Promise.all(
    plugins.map(async (plugin) => ((await import(plugin)).default as Plugin)()),
  );
}

export function getHeaderElements(plugins: PluginResult[]) {
  const header = {
    left: [] as JSX.Element[],
    right: [] as JSX.Element[],
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
