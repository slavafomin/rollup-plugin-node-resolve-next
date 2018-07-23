
# rollup-plugin-node-resolve-next

<!-- NPM Version Badge -->
<a href="https://badge.fury.io/js/rollup-plugin-node-resolve-next">
  <img src="https://badge.fury.io/js/rollup-plugin-node-resolve-next.svg" alt="npm version" height="20">
</a>

<!-- Travis CI Badge -->
<a href="https://travis-ci.org/slavafomin/rollup-plugin-node-resolve-next">
  <img src="https://travis-ci.org/slavafomin/rollup-plugin-node-resolve-next.svg?branch=master" alt="Build Status" height="20">
</a>

<!-- MIT License Badge -->
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20">
</a>

<!-- MIT License Badge -->
<a href="https://codeclimate.com/github/slavafomin/rollup-plugin-node-resolve-next/maintainability">
  <img src="https://api.codeclimate.com/v1/badges/9df208ab261fe8cc64bd/maintainability" alt="Code Climate" height="20">
</a>


---

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
  for different [build targets](#build-targets)
  
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
See the [Build Targets](#build-targets) section for more details

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


## License

Copyright (c) 2018 Slava Fomin II

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



[rollup-org]: https://rollupjs.org
[plugin-node-resolve]: https://github.com/rollup/rollup-plugin-node-resolve
[plugin-node-resolve-angular]: https://github.com/oasisdigital/rollup-plugin-node-resolve-angular
[node-resolution-algo]: https://nodejs.org/api/modules.html#modules_all_together
[browserify-resolve]: https://github.com/browserify/resolve
[node-resolve-issue-171]: https://github.com/rollup/rollup-plugin-node-resolve/issues/171
