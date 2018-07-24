import * as resolve from 'resolve';

import {dirname} from 'path';
import {Minimatch} from 'minimatch';

import {BuildTarget, EmbedMode, EmbedOptions, Options} from './types';


const DEFAULT_OPTIONS: Partial<Options> = {
  mode: BuildTarget.NORMAL,
  embed: {
    mode: EmbedMode.EMBED_EVERYTHING
  }
};


export class NodeNextResolver {

  private readonly options: Partial<Options> = {};


  constructor(options?: Partial<Options>) {

    if (options) {
      this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    }

  }


  async resolveId(importee: string, importer?: string): Promise<string | null | false> {

    // Resolving path
    const resolvedPath = await this.resolvePath(importee, importer);
    if (!resolvedPath) {
      return null;
    }

    const shouldEmbed = this.shouldEmbed(importee);

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

  private shouldEmbed(moduleId: string): boolean {

    if (!this.options.embed) {
      return true;
    }

    // Local modules are always embedded
    if (this.isLocalModule(moduleId)) {
      return true;
    }

    switch (this.options.embed.mode) {

      case EmbedMode.EMBED_EVERYTHING:
        return true;

      case EmbedMode.EMBED_MATCHED:
      case EmbedMode.EMBED_UNMATCHED:
        return this.shouldEmbedByPatterns(moduleId);

    }

  }

  private isLocalModule(moduleId: string): boolean {
    const localPrefixes = ['./', '../', '/'];
    return localPrefixes.some(prefix => moduleId.startsWith(prefix));
  }

  private shouldEmbedByPatterns(moduleId: string): boolean {

    const embedOptions: Partial<EmbedOptions> = this.options.embed || {};

    const patterns = embedOptions.patterns || [];

    // Matching the module ID against specified glob patterns
    let matched = false;
    patterns.forEach(pattern => {
      const minimatch = new Minimatch(pattern);
      if (minimatch.match(moduleId)) {
        matched = !minimatch.negate;
      }
    });

    // Determining whether to embed module or not
    // based on specified embed mode and match result
    if (matched && embedOptions.mode === EmbedMode.EMBED_MATCHED) {
      return true;

    } else if (!matched && embedOptions.mode === EmbedMode.EMBED_UNMATCHED) {
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

  private rewritePackage(pkg: any): any {

    let order: string[] = [];

    if (this.options.mode === BuildTarget.ESM5) {
      order = ['module'];
    } else if (this.options.mode === BuildTarget.ESM2015) {
      order = ['es2015', 'module'];
    }

    let main = pkg.main;

    if (order.length > 0) {
      for (const key of order) {
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
