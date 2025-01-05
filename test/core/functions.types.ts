type ScopeOptions = {
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
};

export type { ScopeOptions };
