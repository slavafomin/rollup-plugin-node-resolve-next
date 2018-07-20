
export interface Options {

  /**
   * In "NORMAL" mode only the "main" field of the package.json is used.
   * In "ESM5" mode the "module" field of the package.json is used with fallback to "main".
   * In "ESM2015" mode the "es2015" field of the package.json is used with fallback to "module" or "main".
   */
  mode: 'NORMAL' | 'ESM5' | 'ESM2015';

  /**
   * These options control embedding behavior.
   */
  embed?: EmbedOptions;

}

export interface EmbedOptions {

  mode: 'DO_NOT_EMBED' | 'EMBED_EVERYTHING' | 'EMBED_MATCHED' | 'EMBED_UNMATCHED';

  /**
   * List of glob patterns supported by minimatch.
   * Negative patterns could also be used.
   */
  patterns?: string[];

  /**
   * A base path used for matching.
   *
   * A full absolute path will be resolved for each module,
   * then base path will be removed from it's beginning (if specified),
   * then pattern matching will be performed against truncated path.
   */
  basePath?: string;

}
