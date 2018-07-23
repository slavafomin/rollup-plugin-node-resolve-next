
import {OutputChunk, rollup, RollupFileOptions} from 'rollup';

import nodeResolveNext from '../src/plugin';
import {Options as PluginOptions} from '../src/types';


export interface BuildCaseOptions {
  pluginOptions: Partial<PluginOptions>;
}


export async function buildAndExecuteCase(
  caseName: string,
  options: BuildCaseOptions = {
    pluginOptions: {}
  }
): Promise<any> {

  const { generated } = await buildCase(caseName, options);

  const module = executeBundle(generated);

  return { generated, module };

}

export async function buildCase(
  caseName: string,
  options: BuildCaseOptions = {
    pluginOptions: {}
  }
): Promise<{ generated: OutputChunk; }> {

  const bundle = await rollup(<RollupFileOptions> {
    input: `${__dirname}/cases/${caseName}/index.js`,
    plugins: [
      nodeResolveNext(options.pluginOptions)
    ]
  });

  const generated = await bundle.generate({ format: 'cjs' });

  return { generated };

}


function executeBundle(generated: OutputChunk): any {

  const module = { exports: {} };

  const fn = new Function('module', 'exports', 'require', generated.code);

  const require = function (moduleId: string) {
    return { name: 'EXTERNAL' };
  };

  fn(module, module.exports, require);

  return module;

}
