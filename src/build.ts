import { walkSync } from "std/fs/walk.ts";
import { posix, resolve, win32 } from "std/path/mod.ts";
import { parse } from "std/yaml/mod.ts";
import { render } from "./lib/render.ts";
import { copySync } from "std/fs/copy.ts";
import { getMagic } from "./lib/magic.ts";
import { CSS } from "./lib/css.ts";
import { Config } from "./lib/types.ts";
import { loadPlugins } from "./utils.ts";

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
  const plugins = config.plugins ? await loadPlugins(config.plugins) : [];

  for (const plugin of plugins) {
    if (!plugin.routes || !plugin.handle) continue;

    for (const route of plugin.routes) {
      const response = new Uint8Array(
        await (await plugin.handle(
          new Request("http://localhost:8000" + route),
        )).arrayBuffer(),
      );
      const path = resolve("build", route.slice(1));

      if (route.includes(".")) {
        await Deno.writeFile(path, response);
      } else {
        await Deno.mkdir(path, { recursive: true });
        await Deno.writeFile(resolve(path, "index.html"), response);
      }
    }
  }

  for (
    const entry of walkSync("./pages", { includeDirs: false, skip: [/\/_/] })
  ) {
    const extracted = (Deno.build.os == "windows"
      ? posix.fromFileUrl(win32.toFileUrl(posix.resolve(entry.path)))
      : resolve(entry.path)).match(
        /.+?\/pages(.+)\./,
      )!;

    const folder = extracted[1].slice(1).replace("index", "");
    Deno.mkdirSync(resolve("build", folder), { recursive: true });
    Deno.writeTextFileSync(
      resolve("build", folder, "index.html"),
      await render(config, magic, folder, plugins),
    );
  }
}
