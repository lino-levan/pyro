import type { JSX } from "preact";
export type { JSX } from "preact";

type MaybePromise<T> = T | Promise<T>;

export interface Config {
  title: string;
  github?: string;
  copyright?: string;
  footer?: Record<string, string[]>;
  plugins?: string[];
}

export type PluginResult = {
  /**
   * Header bar elements
   */
  header?: {
    left?: JSX.Element;
    right?: JSX.Element;
  };
  /**
   * A method that returns a list of routes to handle.
   * This has to be a finite list for static site building.
   */
  routes?: string[];
  /**
   * The method for actually handling whatever route
   */
  handle?: (req: Request) => MaybePromise<Response>;
};

export type Plugin = () => MaybePromise<PluginResult>;

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
