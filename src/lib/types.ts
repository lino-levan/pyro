export interface Config {
  title: string;
  github?: string;
  copyright?: string;
  footer?: Record<string, [string, string][]>;
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
