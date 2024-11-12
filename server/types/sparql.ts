type BindingObject<T extends Record<keyof T, string>> = {
  [K in keyof T]: {
    value: string;
  };
};

export type SparqlResponse<T extends Record<keyof T, string>> = {
  head: {
    vars: (keyof T)[];
  };
  results: {
    bindings: BindingObject<T>[];
  };
};
