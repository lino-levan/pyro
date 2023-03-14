import remarkGfm from "https://esm.sh/remark-gfm@3.0.1";
import rehypeHighlight from "https://esm.sh/@mapbox/rehype-prism@0.8.0";
import { compile } from "https://esm.sh/@mdx-js/mdx@2.2.1";
import { render } from "gfm";
import type { FileTypes } from "./lib/types.ts";

import "https://esm.sh/prismjs@1.29.0/components/prism-json?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-yaml?no-check";

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
