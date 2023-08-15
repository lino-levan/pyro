import type { JSX } from "../../deps.ts";
export type { JSX } from "../../deps.ts";

type MaybePromise<T> = T | Promise<T>;

export interface Config {
  title: string;
  github?: string;
  copyright?: string;
  header?: { left?: string[]; right?: string[] };
  footer?: Record<string, string[]>;
  hide_navbar?: boolean;
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

export type FileTypes = "md" | "tsx";
