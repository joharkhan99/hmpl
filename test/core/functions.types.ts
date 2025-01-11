interface ScopeOptions {
  code?: number;
  afterCode?: number;
  template?: any;
  times?: number;
  route?: string;
  isAfter?: boolean;
  isRejected?: boolean;
  method?: string;
  afterTemplate?: string;
  headers?: Record<string, string>;
  afterHeaders?: Record<string, string>;
}

interface EventOptions {
  timeout?: number;
}

export type { ScopeOptions, EventOptions };
