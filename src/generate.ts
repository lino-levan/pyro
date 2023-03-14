import { join } from "std/path/mod.ts";

/**
 * Generate the skeleton for a pyro documentation site
 */
export async function generate(path: string) {
  Deno.mkdirSync(join(path, "pages", "getting-started"), { recursive: true });
  Deno.mkdirSync(join(path, "static"), { recursive: true });

  Deno.writeTextFileSync(
    join(path, "pyro.yml"),
    "title: Pyro Site\ngithub: https://github.com/lino-levan/pyro"
  );

  Deno.writeTextFileSync(
    join(path, "pages", "index.md"),
    `---
title: Hello World
description: My first Pyro page
index: 0
---

How are you doing today?
`,
  );

  Deno.writeTextFileSync(
    join(path, "pages", "getting-started", "index.md"),
    `---
title: Getting Started
description: My first Pyro directory
index: 1
---
`,
  );

  Deno.writeTextFileSync(
    join(path, "pages", "getting-started", "submenu.md"),
    `---
title: Submenu
description: My first Pyro directory
index: 0
---

This is the first subpage in the docs. We have access to all of markdown and html here.

| We have     | Tables      |
| ----------- | ----------- |
| 1, 1        | 1, 2        |
| 2, 1        | 2, 2        |

We even support Github extensions to the spec like math blocks.

$$
x^2 + y^2 = z^2
$$
`,
  );

  const icon = await fetch(
    "https://raw.githubusercontent.com/lino-levan/pyro/main/www/static/icon.png",
  );

  Deno.writeFileSync(
    join(path, "static", "icon.png"),
    new Uint8Array(await icon.arrayBuffer()),
  );
}
