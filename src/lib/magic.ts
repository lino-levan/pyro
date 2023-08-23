// This file is for all of the "magic" autoconfig we do
// For example, we select the background color from the logo
// No config needed!
import { decode } from "../../deps.ts";
import type { Magic } from "./types.ts";

function saturation(r: number, g: number, b: number) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const lum = max - min;

  if (lum < 0.5) {
    return (max - min) / (max + min);
  } else {
    return (max - min) / (2 - max - min);
  }
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function getBackground() {
  try {
    const logo = Deno.readFileSync("./static/icon.png");
    const bytes = decode(logo);

    let brightest_color = "#000000";
    let max_brightness = 0;

    for (let i = 0; i < bytes.image.length; i += 4) {
      const [r, g, b, a] = [
        bytes.image[i],
        bytes.image[i + 1],
        bytes.image[i + 2],
        bytes.image[i + 3],
      ];
      const brightness = saturation(r, g, b) * a;

      if (brightness > max_brightness) {
        max_brightness = brightness;
        brightest_color = `#${componentToHex(r)}${componentToHex(g)}${
          componentToHex(b)
        }`;
      }
    }

    return brightest_color;
  } catch {
    return "white";
  }
}

export function getMagic(): Magic {
  return {
    background: getBackground(),
  };
}
