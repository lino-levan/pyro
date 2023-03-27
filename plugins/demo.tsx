import { Plugin } from "../src/lib/types.ts";

const plugin: Plugin = () => {
  return {
    header: {
      left: <a href="/demo.png">Demo</a>,
      right: <a href="/" class="hover:bg-red-500">Home</a>,
    },
    routes: ["/demo.png"],
    handle: async () => {
      const req = await fetch(
        "https://github.com/lino-levan/pyro/raw/main/www/static/icon.png",
      );
      return req;
    },
  };
};

export default plugin;
