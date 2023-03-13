import { serve } from "std/http/server.ts";
import { resolve } from "std/path/mod.ts";
import { serveDir } from "std/http/file_server.ts";
import { render } from "./lib/render.ts";
import { getMagic } from "./lib/magic.ts";

export function dev() {
  const config = JSON.parse(Deno.readTextFileSync("deno.jsonc")).pyro;

  serve((req) => {
    const url = new URL(req.url);
    const pathname = url.pathname.slice(1);

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
      render(config, getMagic(), resolve("pages", pathname)),
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  });
}
