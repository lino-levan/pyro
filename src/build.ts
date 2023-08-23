import {
  copySync,
  esbuild,
  launch,
  posix,
  resolve,
  serveDir,
  walkSync,
  win32,
} from "../deps.ts";
import { render } from "./lib/render.ts";
import { getMagic } from "./lib/magic.ts";
import { CSS } from "./lib/css.ts";
import { loadPlugins, readConfig } from "./utils.tsx";

async function screenshot() {
  console.log("Embedding pages...");

  const controller = new AbortController();
  const port = 8412;

  const server = Deno.serve({ signal: controller.signal, port }, (req) => {
    return serveDir(req, {
      fsRoot: "build",
      quiet: true,
    });
  });

  // TODO(lino-levan): Just do this better. What is this?
  const browser = await launch({
    args: [`--window-size=1920,1080`],
  });
  const page = await browser.newPage();
  const celestial = page.unsafelyGetCelestialBindings();
  await celestial.Emulation.setScrollbarsHidden({ hidden: true });

  for (
    const entry of walkSync("./build", {
      includeDirs: false,
      match: [/^.+index\.html$/],
    })
  ) {
    const url = new URL(entry.path.slice(5, -10), `http://localhost:${port}`);
    console.log("Embedding:", url.href);
    await page.goto(url.href, { waitUntil: "networkidle0" });
    const screenshot = await page.screenshot();
    Deno.writeFileSync(
      resolve(entry.path.slice(0, -10), "embed.png"),
      screenshot,
    );
  }

  await browser.close();

  controller.abort();
  await server.finished;
}

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

  const config = readConfig();
  const magic = getMagic();
  const plugins = config.plugins ? await loadPlugins(config.plugins) : [];

  for (const plugin of plugins) {
    if (!plugin.routes || !plugin.handle) continue;

    for (const route of plugin.routes) {
      console.log(`Created plugin route: ${route}`);
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
    console.log(`Rendered route: ${entry.path}`);

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

  esbuild.stop();

  if (config.base) {
    await screenshot();
  }
}
