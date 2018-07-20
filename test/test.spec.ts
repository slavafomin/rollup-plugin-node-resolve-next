
import 'mocha';

import {expectExports} from './utils';


describe('rollup-plugin-node-resolve-next', () => {

  it('simple case / default options', async () => {

    await expectExports('default', {
      message: 'Hello World'
    });

  });

  it('node module w/o manifest', async () => {

    await expectExports('node-module-no-manifest', {
      name: 'no-manifest'
    });

  });

  it('node module with manifest, but without fields', async () => {

    await expectExports('node-module-manifest-no-fields', {
      name: 'manifest-no-fields'
    });

  });

  it('node module with manifest and main field, but wrong index file', async () => {

    await expectExports('node-module-manifest-main-wrong-index', {
      name: 'manifest-main-field-wrong-index'
    });

  });

  it('scoped node module with manifest, but without fields', async () => {

    await expectExports('scoped-node-module-manifest-no-fields', {
      name: 'scoped-manifest-no-fields'
    });

  });

  it('resolves to UMD in default mode', async () => {

    await expectExports('full-featured-module', {
      name: 'full-featured-module-umd'
    }, {
      mode: 'NORMAL'
    });

  });

  it('resolves to ESM2015 in ESM2015 mode', async () => {

    await expectExports('full-featured-module', {
      name: 'full-featured-module-esm2015'
    }, {
      mode: 'ESM2015'
    });

  });

  it('resolves to ESM5 in ESM5 mode', async () => {

    await expectExports('full-featured-module', {
      name: 'full-featured-module-esm5'
    }, {
      mode: 'ESM5'
    });

  });

});
