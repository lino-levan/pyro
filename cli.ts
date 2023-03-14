import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import * as path from "https://deno.land/std@0.179.0/path/mod.ts";
import { generate } from "./src/generate.ts";
import { dev } from "./src/dev.ts";
import { build } from "./src/build.ts";

await new Command()
  .name("pyro")
  .version("0.3.0")
  .description("The documentation site generator for Deno")
  .command("gen", "Generate a Pyro site.")
  .arguments("<path:string>")
  .action((_, p) => {
    generate(path.resolve(p));
  })
  .command("dev", "Start the Pyro dev server")
  .option("-p, --port <value:number>", "Specify a port for the the dev server")
  .option(
    "-n, --hostname <value:string>",
    "Specify a hostname for the dev server",
  )
  .action(({ port, hostname }) => {
    dev(hostname, port);
  })
  .command("build", "Build the static Pyro site")
  .action(() => {
    build();
  })
  .parse(Deno.args);
