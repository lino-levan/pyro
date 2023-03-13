export interface Config {
  title: string;
  github?: string;
  copyright?: string;
  footer?: Record<string, [string, string][]>;
}

export interface Magic {
  background: string;
}
