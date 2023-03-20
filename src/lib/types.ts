import { MaybeColorValue } from "https://esm.sh/@twind/core@1.1.3";

export interface Config {
  title: string;
  icon?: string;
  github?: string;
  theme?: ThemeConfig;
  copyright?: string;
  footer?: Record<string, string[]>;
}

export interface ThemeConfig {
  colors: Record<string, MaybeColorValue>;
}

export interface Magic {
  background: string;
}

export interface RouteMap {
  title: string;
  url: string;
  index: number;
  sub_route_map?: RouteMap[];
}

export type FileTypes = "md" | "mdx";
