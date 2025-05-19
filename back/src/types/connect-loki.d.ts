declare module "connect-loki" {
  import { Store, SessionOptions } from "express-session";

  interface LokiStoreOptions {
    path?: string;
    logErrors?: boolean | ((error: Error) => void);
    ttl?: number;
    autoSaveInterval?: number;
    autosave?: boolean;
    autosaveInterval?: number;
    onSave?: (
      store: LokiStore,
      callback: (error: Error | null) => void,
    ) => void;
  }

  class LokiStore extends Store {
    constructor(options?: LokiStoreOptions);
  }

  function connectLoki(
    session: typeof import("express-session"),
  ): typeof LokiStore;

  export default connectLoki;
}
