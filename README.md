
# rollup-plugin-node-resolve-next

<a href="https://badge.fury.io/js/rollup-plugin-node-resolve-next"><img src="https://badge.fury.io/js/rollup-plugin-node-resolve-next.svg" alt="npm version" height="18"></a>


[Rollup][rollup-org] plugin for imports resolution using enhanced Node.js algorithm.

Could be used as an alternative to both
[rollup-plugin-node-resolve][plugin-node-resolve] and
[rollup-plugin-node-resolve-angular][plugin-node-resolve-angular] modules.


## Features

- Resolves imported modules using [Node.js Resolution Algorithm][node-resolution-algo]

- Doesn't implement the resolution on it's own, but instead delegates
  this complex task to a well supported module: [browserify/resolve][browserify-resolve]

- Has a well-structured architecture and doesn't mix the concepts like
  `rollup-plugin-node-resolve` [does][node-resolve-issue-171].
  **Module resolution** and **embedding conditionals** are two separate concepts

- Allows flexibility in control of which modules will be embedded and which externalized
  using glob patterns on module ids
  
- Supports `main`/`module`/`es2015` fields of `package.json`
  for different [build targets](#Build Targets)
  
- Reliable: written in TypeScript and automatically tested


## Example

```js
// rollup.config.js
import nodeResolveNext from 'rollup-plugin-node-resolve-next';

export default {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'es'
  },
  plugins: [
    nodeResolveNext({
      mode: 'ESM2015',
      embed: {
        mode: 'EMBED_MATCHED',
        patterns: [
          '@lodash/*',
          'tslib'
        ] 
      }
    })
  ]
};
```
   
## Options

`options.mode` — controls the build target.
See the [Build Targets](#Build Targets) section for more details

`options.embed.mode` — controls the module embedding mode, possible values are:

- `EMBED_EVERYTHING` — embeds all imported modules to the bundle
- `EMBED_MATCHED` — embeds only matched modules
- `EMBED_UNMATCHED` — embeds only non-matched modules

`options.embed.patterns` — list of glob patterns used to configure the matching.
Used only in `EMBED_MATCHED` and `EMBED_UNMATCHED` modes.


### Build Targets

The plugin supports various `main` fields from `package.json` manifests
of the imported modules for different build targets:

 - In `NORMAL` mode only the `main` field is used *(this is the default)*
 - In `ESM5` mode the `module` field is used with fallback to `main`
 - In `ESM2015` mode the `es2015` field of is used with fallback to `module` or `main`
 

## Maintainers

— [Slava Fomin II](mailto:slava@fomin.io)



[rollup-org]: https://rollupjs.org
[plugin-node-resolve]: https://github.com/rollup/rollup-plugin-node-resolve
[plugin-node-resolve-angular]: https://github.com/oasisdigital/rollup-plugin-node-resolve-angular
[node-resolution-algo]: https://nodejs.org/api/modules.html#modules_all_together
[browserify-resolve]: https://github.com/browserify/resolve
[node-resolve-issue-171]: https://github.com/rollup/rollup-plugin-node-resolve/issues/171
