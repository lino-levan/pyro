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
