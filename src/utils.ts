import remarkGfm from "https://esm.sh/remark-gfm@3.0.1";
import rehypeHighlight from "https://esm.sh/@mapbox/rehype-prism@0.8.0";
import { compile } from "https://esm.sh/@mdx-js/mdx@2.2.1";
import { render } from "gfm";

export function readFileSync(...options: string[]): string {
  if (options.length === 1) {
    return Deno.readTextFileSync(options[0]);
  }
  try {
    return Deno.readTextFileSync(options[0]);
  } catch {
    options.shift();
    return readFileSync(...options);
  }
}

export async function renderMDX(data: string) {
  return (await compile(data.replace(/^---.+?---/s, ""), {
    jsxImportSource: "preact",
    outputFormat: "program",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  })).value;
}

// deno-lint-ignore require-await
export async function renderMD(data: string) {
  return render(data.replace(/^---.+?---/s, ""), {
    disableHtmlSanitization: true,
  });
}
