import { serve } from "std/http/server.ts";
import { resolve } from "std/path/mod.ts";
import { serveDir } from "std/http/file_server.ts";
import { render } from "./lib/render.ts";
import { getMagic } from "./lib/magic.ts";
import { CSS } from "./lib/css.ts";
import { parse } from "std/encoding/yaml.ts";
import { Config } from "./lib/types.ts";

export async function dev() {
  const config = parse(Deno.readTextFileSync("pyro.yml")) as Config;
  let BUILD_ID = Math.random().toString();

  serve(async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname.slice(1);

    // Handle the bundled css
    if (pathname === "_pyro/bundle.css") {
      return new Response(CSS, {
        headers: {
          "Content-Type": "text/css",
        },
      });
    }

    // Handle the reload js
    if (pathname === "_pyro/reload.js") {
      return new Response(
        `new EventSource("/_pyro/reload").addEventListener("message", function listener(e) { if (e.data !== "${BUILD_ID}") { this.removeEventListener('message', listener); location.reload(); } });`,
        {
          headers: {
            "Content-Type": "text/css",
          },
        },
      );
    }

    if (pathname === "_pyro/reload") {
      let timerId: number | undefined = undefined;
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(`data: ${BUILD_ID}\nretry: 100\n\n`);
          timerId = setInterval(() => {
            controller.enqueue(`data: ${BUILD_ID}\n\n`);
          }, 1000);
        },
        cancel() {
          if (timerId !== undefined) {
            clearInterval(timerId);
          }
        },
      });
      return new Response(body.pipeThrough(new TextEncoderStream()), {
        headers: {
          "content-type": "text/event-stream",
        },
      });
    }

    // We're supposed to serve a static file
    if (pathname.includes(".")) {
      try {
        return serveDir(req, {
          fsRoot: "./static",
          quiet: true,
        });
      } catch (err) {
        console.log(err);
        return new Response("404 File Not Found", {
          status: 404,
        });
      }
    }

    return new Response(
      await render(config, getMagic(), resolve("pages", pathname), true),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  });

  const watcher = Deno.watchFs(".", { recursive: true });

  for await (const event of watcher) {
    BUILD_ID = Math.random().toString();
  }
}
