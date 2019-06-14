
export enum BuildTarget {
  NORMAL = 'NORMAL',
  ESM5 = 'ESM5',
  ESM2015 = 'ESM2015',
}

export enum EmbedMode {
  EMBED_EVERYTHING = 'EMBED_EVERYTHING',
  EMBED_MATCHED = 'EMBED_MATCHED',
  EMBED_UNMATCHED = 'EMBED_UNMATCHED',
}

export interface Options {

  /**
   * In "NORMAL" mode only the "main" field of the package.json is used.
   * In "ESM5" mode the "module" field of the package.json is used with fallback to "main".
   * In "ESM2015" mode the "es2015" field of the package.json is used with fallback to "module" or "main".
   */
  mode: BuildTarget;

  /**
   * These options control embedding behavior.
   */
  embed?: EmbedOptions;

}

export interface EmbedOptions {

  mode: EmbedMode;

  /**
   * List of glob patterns supported by minimatch.
   * Negative patterns could also be used.
   */
  patterns?: string[];

}
