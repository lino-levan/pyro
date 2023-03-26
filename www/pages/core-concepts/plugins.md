---
title: Plugins
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 3
---

While Pyro is designed to have all of the basic features you will need built-in,
there are some cases where one would want to extend the feature set. This can be
achieved with plugins.

A simple plugin will look like so:

```tsx
import { Plugin } from "https://deno.land/x/pyro/src/lib/types.ts";

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
```

More examples can be found in
[the official plugins](https://github.com/lino-levan/pyro/tree/main/plugins).
