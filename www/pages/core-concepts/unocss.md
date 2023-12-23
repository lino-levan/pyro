---
title: UnoCSS
description: Pyro uses UnoCSS to provide an atomic CSS engine.
index: 3
---

Pyro uses UnoCSS for styling, both internally and for user code. By default, the
configuration that Pyro uses for UnoCSS looks something like:

```ts
import { presetUno } from "https://esm.sh/@unocss/preset-uno@0.58.0";

export default {
  presets: [
    presetUno({
      dark: "media",
    }),
  ],
};
```

Some users would prefer to have more UnoCSS features. This is supported with
zero extra configuration outside of just making the file! At the top level of
your site, just add a `uno.config.ts` file. Below is an example of configuring
UnoCSS to add the `presetTypography` plugin. Make sure not to import from the
main `uno` package, as that is unsupported.

```ts
// uno.config.ts
import { presetUno } from "https://esm.sh/@unocss/preset-uno@0.58.0";
import { presetTypography } from "https://esm.sh/@unocss/preset-typography@0.58.0";

export default {
  presets: [
    presetUno({
      dark: "media",
    }),
    presetTypography(),
  ],
};
```
