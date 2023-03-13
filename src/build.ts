import { walkSync } from "std/fs/walk.ts";
import { join, resolve } from "std/path/mod.ts";
import { render } from "./lib/render.ts";
import { copySync } from "std/fs/copy.ts";
import { getMagic } from "./lib/magic.ts";
import { CSS } from "./lib/css.ts";

export function build() {
  try {
    Deno.removeSync("build", {
      recursive: true,
    });
  } catch {
    // no-op
  }

  copySync("./static", "./build");

  Deno.writeTextFileSync("./build/bundle.css", CSS);

  const config = JSON.parse(Deno.readTextFileSync("deno.jsonc")).pyro;
  const magic = getMagic();

  for (const entry of walkSync("./pages", { includeDirs: false })) {
    const extracted = resolve(entry.path).match(
      /.+?\/pages(.+)\./,
    )!;
    const folder = extracted[1].slice(1).replace("index", "");
    Deno.mkdirSync(join("build", folder), { recursive: true });
    Deno.writeTextFileSync(
      resolve("build", folder, "index.html"),
      render(config, magic, folder),
    );
  }
}
