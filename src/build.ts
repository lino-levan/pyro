import { walkSync } from "std/fs/walk.ts";
import { join, posix, resolve, win32 } from "std/path/mod.ts";
import { parse } from "std/encoding/yaml.ts";
import { render } from "./lib/render.ts";
import { copySync } from "std/fs/copy.ts";
import { getMagic } from "./lib/magic.ts";
import { CSS } from "./lib/css.ts";
import { Config } from "./lib/types.ts";

export async function build() {
  try {
    Deno.removeSync("build", {
      recursive: true,
    });
  } catch {
    // no-op
  }

  copySync("./static", "./build");

  Deno.mkdirSync("./build/_pyro");
  Deno.writeTextFileSync("./build/_pyro/bundle.css", CSS);

  const config = parse(Deno.readTextFileSync("pyro.yml")) as Config;
  const magic = getMagic();

  for (const entry of walkSync("./pages", { includeDirs: false })) {
    const extracted = (Deno.build.os == "windows"
      ? posix.fromFileUrl(win32.toFileUrl(posix.resolve(entry.path)))
      : resolve(entry.path)).match(
        /.+?\/pages(.+)\./,
      )!;

    const folder = extracted[1].slice(1).replace("index", "");
    Deno.mkdirSync(join("build", folder), { recursive: true });
    Deno.writeTextFileSync(
      resolve("build", folder, "index.html"),
      await render(config, magic, folder),
    );
  }
}
