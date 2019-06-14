
import { Plugin } from 'rollup';

import { NodeNextResolver } from './resolver';
import { Options } from './types';


export function nodeResolveNext(options?: Partial<Options>): Plugin {

  const resolver = new NodeNextResolver(options);

  return {

    name: 'node-resolve-next',

    resolveId: resolver.resolveId.bind(resolver),

  };

}
