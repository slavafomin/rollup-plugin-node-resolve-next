
import {expect} from 'chai';
import {OutputChunk, rollup, RollupFileOptions} from 'rollup';

import nodeResolveNext from '../src/plugin';
import {Options} from '../src/types';


export async function expectExports(
  caseName: string,
  expectedExports: { [key: string]: any },
  options?: Options

): Promise<void> {

  const module = await runRollup(`cases/${caseName}/index.js`, options);

  Object.keys(expectedExports).forEach(key => {
    const expected = expectedExports[key];
    expect(module.exports[key]).to.equal(expected);
  });

}

export async function runRollup(path: string, options?: Options): Promise<any> {

  const bundle = await rollup({
    input: __dirname + '/' + path,
    plugins: [
      nodeResolveNext(options)
    ]
  } as RollupFileOptions);

  return bundle
    .generate({ format: 'cjs' })
    .then(executeBundle);

}

export function executeBundle(generated: OutputChunk): any {

  const module = { exports: {} };

  const fn = new Function('module', 'exports', generated.code);

  fn(module, module.exports);

  return module;

}
