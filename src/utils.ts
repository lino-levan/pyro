export function readFileSync(...options: string[]): string {
  if (options.length === 1) {
    return Deno.readTextFileSync(options[0]);
  }
  try {
    return Deno.readTextFileSync(options[0]);
  } catch {
    options.shift();
    return readFileSync(...options);
  }
}
