---
title: UnoCSS
description: Pyro uses UnoCSS to provide an atomic CSS engine.
index: 3
---

Pyro uses UnoCSS for styling, both internally and for user code. By default, the
configuration that Pyro uses for UnoCSS looks something like:

```ts
import { defineConfig, presetUno } from "https://esm.sh/unocss@0.55.1";

export default defineConfig({
  presets: [
    presetUno({
      dark: "media",
    }),
  ],
});
```

Some users would prefer to have more UnoCSS features. This is supported with
zero extra configuration outside of just making the file! At the top level of
your site, just add a `uno.config.ts` file. Below is an example of configuring
UnoCSS to add the `presetTypography` plugin.

```ts
// uno.config.ts
import {
  defineConfig,
  presetTypography,
  presetUno,
} from "https://esm.sh/unocss@0.55.1";

export default defineConfig({
  presets: [
    presetUno({
      dark: "media",
    }),
    presetTypography(),
  ],
});
```
