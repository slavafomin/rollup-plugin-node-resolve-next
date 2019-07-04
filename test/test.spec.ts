
import 'mocha';

import { expect } from 'chai';

import { NodeNextResolver } from '../src/resolver';
import { BuildTarget, EmbedMode } from '../src/types';
import { buildAndExecuteCase } from './utils';


describe('rollup-plugin-node-resolve-next', () => {

  describe(`with default options`, () => {

    it('simple case / default options', async () => {

      const { module } = await buildAndExecuteCase('default');

      expectModuleExports(module, {
        message: 'Hello World',
      });

    });

    it('node module w/o manifest', async () => {

      const { module } = await buildAndExecuteCase('node-module-no-manifest');

      expectModuleExports(module, {
        name: 'no-manifest',
      });

    });

    it('node module with manifest, but without fields', async () => {

      const { module } = await buildAndExecuteCase('node-module-manifest-no-fields');

      expectModuleExports(module, {
        name: 'manifest-no-fields',
      });

    });

    it('node module with manifest and main field, but wrong index file', async () => {

      const { module } = await buildAndExecuteCase('node-module-manifest-main-wrong-index');

      expectModuleExports(module, {
        name: 'manifest-main-field-wrong-index',
      });

    });

    it('scoped node module with manifest, but without fields', async () => {

      const { module } = await buildAndExecuteCase('scoped-node-module-manifest-no-fields');

      expectModuleExports(module, {
        name: 'scoped-manifest-no-fields',
      });

    });

  });

  describe(`with various resolution modes`, () => {

    it('resolves to UMD in default mode', async () => {

      const { module } = await buildAndExecuteCase('full-featured-module', {
        pluginOptions: {
          mode: BuildTarget.NORMAL,
        },
      });

      expectModuleExports(module, {
        name: 'full-featured-module-umd',
      });

    });

    it('resolves to ESM2015 in ESM2015 mode', async () => {

      const { module } = await buildAndExecuteCase('full-featured-module', {
        pluginOptions: {
          mode: BuildTarget.ESM2015,
        },
      });

      expectModuleExports(module, {
        name: 'full-featured-module-esm2015',
      });


    });

    it('resolves to ESM5 in ESM5 mode', async () => {

      const { module } = await buildAndExecuteCase('full-featured-module', {
        pluginOptions: {
          mode: BuildTarget.ESM5,
        },
      });

      expectModuleExports(module, {
        name: 'full-featured-module-esm5',
      });

    });

    it('resolves to ESM5 in ESM5 mode', async () => {

      const { module } = await buildAndExecuteCase('full-featured-module', {
        pluginOptions: {
          mode: BuildTarget.ESM5,
        },
      });

      expectModuleExports(module, {
        name: 'full-featured-module-esm5',
      });

    });

  });

  describe(`with various embedding modes`, () => {

    it('embeds everything in EMBED_EVERYTHING mode', async () => {

      const { module } = await buildAndExecuteCase('embedded-vs-external', {
        pluginOptions: {
          mode: BuildTarget.ESM2015,
          embed: {
            mode: EmbedMode.EMBED_EVERYTHING,
          },
        },
      });

      expectModuleExports(module, {
        bar: 'Bar',
        foo: 'Foo',
        fullFeaturedModule: 'full-featured-module-esm2015',
        noManifest: 'no-manifest',
        scopedManifestNoFields: 'scoped-manifest-no-fields',
      });

    });

    it('embeds only matched modules in EMBED_MATCHED mode', async () => {

      const { module } = await buildAndExecuteCase('embedded-vs-external', {
        pluginOptions: {
          mode: BuildTarget.ESM2015,
          embed: {
            mode: EmbedMode.EMBED_MATCHED,
            patterns: [
              '@scoped/*',
              'no-manifest',
            ],
          },
        },
      });

      expectModuleExports(module, {
        bar: 'Bar',
        foo: 'Foo',
        fullFeaturedModule: 'EXTERNAL',
        noManifest: 'no-manifest',
        scopedManifestNoFields: 'scoped-manifest-no-fields',
      });

    });

    it('embeds only unmatched modules in EMBED_UNMATCHED mode', async () => {

      const { module } = await buildAndExecuteCase('embedded-vs-external', {
        pluginOptions: {
          mode: BuildTarget.ESM2015,
          embed: {
            mode: EmbedMode.EMBED_UNMATCHED,
            patterns: [
              '@scoped/*',
            ],
          },
        },
      });

      expectModuleExports(module, {
        bar: 'Bar',
        foo: 'Foo',
        fullFeaturedModule: 'full-featured-module-esm2015',
        noManifest: 'no-manifest',
        scopedManifestNoFields: 'EXTERNAL',
      });

    });

  });

  it('supports custom extensions', async () => {

    const { module } = await buildAndExecuteCase('custom-extensions', {
      pluginOptions: {
        extensions: ['.js', '.jsx', '.jsm'],
      },
    });

    expectModuleExports(module, {
      foo: 'Foo',
      bar: 'Bar',
    });

  });

  it('correctly handles null-prefixed module IDs', async () => {

    await buildAndExecuteCase('null-prefixed-module-id');

  });

  describe('NodeNextResolver', () => {

    it('resolves symlinks in paths', async () => {

      const resolver = new NodeNextResolver({
        embed: {
          mode: EmbedMode.EMBED_EVERYTHING,
        },
        resolveSymlinks: true,
      });

      const resolvedPath = await resolver.resolveId('no-manifest-symlinked', `${__dirname}/cases/default/index.js`);

      expect(resolvedPath).to.be.a('string');

      expect(resolvedPath).to.match(/\/node_modules\/no-manifest\/index.js$/);

    });

  });

});


function expectModuleExports(module: any, exports: Object): void {
  expect(module).to.deep.equal({ exports });
}
