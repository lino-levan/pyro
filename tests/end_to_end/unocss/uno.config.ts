import {
  defineConfig,
  presetTypography,
  presetUno,
} from "https://esm.sh/unocss@0.55.2";

export default defineConfig({
  presets: [
    presetUno({
      dark: "media",
    }),
    presetTypography(),
  ],
});
