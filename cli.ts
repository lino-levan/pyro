import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import * as path from "https://deno.land/std@0.179.0/path/mod.ts";
import { generate } from "./src/generate.ts";
import { dev } from "./src/dev.ts";
import { build } from "./src/build.ts";

await new Command()
  .name("pyro")
  .version("0.1.0")
  .description("The documentation site generator for Deno")
  .command("gen", "Generate a Pyro site.")
  .arguments("<path:string>")
  .action((_, p) => {
    generate(path.resolve(p));
  })
  .command("dev", "Start the Pyro dev server")
  .action(() => {
    dev();
  })
  .command("build", "Build the static Pyro site")
  .action(() => {
    build();
  })
  .parse(Deno.args);
