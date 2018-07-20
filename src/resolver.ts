
import * as resolve from 'resolve';

import {dirname} from 'path';
import {Minimatch} from 'minimatch';

import {EmbedOptions, Options} from './types';


const DEFAULT_OPTIONS: Partial<Options> = {
  mode: 'NORMAL',
  embed: {
    mode: 'EMBED_EVERYTHING'
  }
};


export class NodeNextResolver {

  private readonly options: Partial<Options> = {};

  // Regex used to remove base path from module path
  private readonly embedPathRegex: RegExp;


  constructor(options?: Partial<Options>) {

    if (options) {

      this.options = Object.assign({}, DEFAULT_OPTIONS, options);

      if (options.embed && options.embed.basePath) {
        this.embedPathRegex = new RegExp('^' + options.embed.basePath);
      }

    }

  }


  async resolveId(importee: string, importer?: string): Promise<string | null | false> {

    // Resolving path
    const resolvedPath = await this.resolvePath(importee, importer);
    if (!resolvedPath) {
      return null;
    }

    const shouldEmbed = this.shouldEmbed(resolvedPath);

    // Returning result to Rollup
    // "false" means — externalize import
    return (shouldEmbed ? resolvedPath : false);

  }


  private async resolvePath(importee: string, importer?: string): Promise<string> {

    const resolveOptions: resolve.AsyncOpts = {};

    if (importer) {
      resolveOptions.basedir = dirname(importer);
    }

    if (this.options.mode) {
      resolveOptions.packageFilter = this.rewritePackage.bind(this);
    }

    return await this.runResolve(importee, resolveOptions);

  }

  private shouldEmbed(path: string): boolean {

    if (!this.options.embed) {
      return true;
    }

    switch (this.options.embed.mode) {

      case 'DO_NOT_EMBED':
        return false;

      case 'EMBED_EVERYTHING':
        return true;

      case 'EMBED_MATCHED':
      case 'EMBED_UNMATCHED':
        return this.shouldEmbedByPatterns(path);

    }

  }

  private shouldEmbedByPatterns(path: string): boolean {

    const embedOptions: Partial<EmbedOptions> = this.options.embed || {};

    const patterns = embedOptions.patterns || [];

    // Removing base path from the path to match if it's specified
    let pathToMatch = path;
    if (embedOptions.basePath) {
      pathToMatch = pathToMatch.replace(this.embedPathRegex!, '');
    }

    // Matching the path against specified glob patterns
    let matched = false;
    patterns.forEach(pattern => {
      const minimatch = new Minimatch(pattern);
      if (minimatch.match(pathToMatch)) {
        matched = !minimatch.negate;
      }
    });

    // Determining whether to embed module or not
    // based on specified embed mode and match result
    if (matched && embedOptions.mode === 'EMBED_MATCHED') {
      return true;

    } else if (!matched && embedOptions.mode === 'EMBED_UNMATCHED') {
      return true;

    }

    return false;

  }

  /**
   * @todo: replaced with promisify
   */
  private runResolve(path: string, options: resolve.AsyncOpts): Promise<string> {

    return new Promise((next, reject) => {

      resolve(path, options, (error, result) => {

        if (error) {
          reject(error);
          return;
        }

        next(result);

      });

    });

  }

  private rewritePackage(pkg: any) {

    let order: string[] = [];

    if ('ESM5' === this.options.mode) {
      order = ['module'];
    } else if ('ESM2015' === this.options.mode) {
      order = ['es2015', 'module'];
    }

    let main = pkg.main;

    if (order.length > 0) {
      for (let key of order) {
        if (pkg[key]) {
          main = pkg[key];
          break;
        }
      }
    }

    pkg.main = main;

    return pkg;

  }

}
