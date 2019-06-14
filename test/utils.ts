
import { rollup, RollupOutput } from 'rollup';

import nodeResolveNext from '../src/plugin';
import { Options as PluginOptions } from '../src/types';


export interface BuildCaseOptions {
  pluginOptions: Partial<PluginOptions>;
}


export async function buildAndExecuteCase(
  caseName: string,
  options: BuildCaseOptions = {
    pluginOptions: {},
  },

): Promise<any> {

  const output = await buildCase(caseName, options);

  const module = executeBundle(output);

  return { output, module };

}

export async function buildCase(
  caseName: string,
  options: BuildCaseOptions = {
    pluginOptions: {},
  },

): Promise<RollupOutput> {

  const bundle = await rollup({
    input: `${__dirname}/cases/${caseName}/index.js`,
    plugins: [
      nodeResolveNext(options.pluginOptions),
    ],
  });

  return bundle.generate({
    format: 'cjs',
  });

}


function executeBundle(output: RollupOutput): any {

  if (1 !== output.output.length) {
    throw new Error(`Rollup returned multiple chunks, but should return only one`);
  }

  const code = output.output[0].code;

  const module = {
    exports: {},
  };

  const fn = new Function('module', 'exports', 'require', code);

  const require = function (moduleId: string): { name: string } {
    return {
      name: 'EXTERNAL'
    };
  };

  fn(module, module.exports, require);

  return module;

}
