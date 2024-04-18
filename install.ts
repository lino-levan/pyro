// I'm preemptively sorry about this install script.
// Deno has a bug where you can't --config from a remote
// location which makes it impossible afaik to do this
// another way. If you have a better idea, open a PR!
// https://github.com/denoland/deno/issues/13488

let config_file = "./384y89xnd.jsonc";
const install_from = Deno.args[0] ?? "https://deno.land/x/pyro";

if (install_from === ".") {
  config_file = "./deno.jsonc";
} else {
  Deno.writeFileSync(
    config_file,
    new Uint8Array(
      await (await fetch(install_from + "/deno.jsonc")).arrayBuffer(),
    ),
  );
}

const command = new Deno.Command(Deno.execPath(), {
  args: [
    "install",
    "-Afrg",
    "--config",
    config_file,
    "-n",
    "pyro",
    install_from + "/cli.ts",
  ],
});

command.outputSync();

if (install_from !== ".") {
  Deno.removeSync(config_file);
}
