
import {Plugin} from 'rollup';

import {NodeNextResolver} from './resolver';
import {Options} from './types';


// noinspection JSUnusedGlobalSymbols
export default function nodeResolveNext(options?: Partial<Options>): Plugin {

  const resolver = new NodeNextResolver(options);


  // noinspection JSUnusedGlobalSymbols
  return {

    name: 'node-resolve-next',

    resolveId: resolver.resolveId.bind(resolver)

  };

}
