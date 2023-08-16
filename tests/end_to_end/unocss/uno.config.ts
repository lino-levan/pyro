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
