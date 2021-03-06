
import * as resolve from 'resolve';

import { realpath } from 'fs';
import { Minimatch } from 'minimatch';
import { dirname } from 'path';
import { ResolveIdResult } from 'rollup';
import { promisify } from 'util';

import { BuildTarget, EmbedMode, EmbedOptions, Options } from './types';


const $realpath = promisify(realpath);


const DEFAULT_OPTIONS: Partial<Options> = {
  mode: BuildTarget.NORMAL,
  embed: {
    mode: EmbedMode.EMBED_EVERYTHING,
  },
  resolveSymlinks: true,
};


export class NodeNextResolver {

  private readonly options: Partial<Options> = {};


  constructor(options?: Partial<Options>) {

    if (options) {
      this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    }

  }


  public async resolveId(importee: string, importer?: string): Promise<ResolveIdResult> {

    if (/\0/.test(importee)) {
      return null;
    }

    let resolvedPath = await this.resolvePath(importee, importer);
    if (!resolvedPath) {
      return null;
    }

    if (this.options.resolveSymlinks) {
      resolvedPath = await $realpath(resolvedPath);
    }

    const shouldEmbed = this.shouldEmbed(importee);

    // Returning result to Rollup
    // "false" means — externalize import
    return (shouldEmbed ? resolvedPath : false);

  }


  private async resolvePath(importee: string, importer?: string): Promise<string | undefined> {

    const resolveOptions: resolve.AsyncOpts = {};

    if (importer) {
      resolveOptions.basedir = dirname(importer);
    }

    if (this.options.mode) {
      resolveOptions.packageFilter = this.rewritePackage.bind(this);
    }

    if (this.options.extensions) {
      resolveOptions.extensions = this.options.extensions;
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

  private async runResolve(path: string, options: resolve.AsyncOpts): Promise<string | undefined> {

    let result: string | undefined;

    try {

      result = await new Promise((next, reject) => {

        resolve(path, options, (error, $result) => {

          if (error) {
            reject(error);
            return;
          }

          next($result);

        });

      });

    } catch (error) {

      // Ignoring errors

    }

    return result;

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
