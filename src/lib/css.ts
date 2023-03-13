import { CSS as MK_CSS, KATEX_CSS } from "gfm";

export const CSS = (MK_CSS + KATEX_CSS +
  ".markdown-body ul{list-style:disc}.markdown-body ol{list-style: numeric}.markdown-body table{width: fit-content;}details > summary{list-style: none;}details > summary::marker,details > summary::-webkit-details-marker {display: none;}")
  .replaceAll("\n", "");
