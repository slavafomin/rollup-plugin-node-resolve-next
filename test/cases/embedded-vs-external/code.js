'use strict';

var b = require('full-featured-module');

module.exports.name = 'scoped-manifest-no-fields';

var a = /*#__PURE__*/Object.freeze({});

module.exports.name = 'no-manifest';

var c = /*#__PURE__*/Object.freeze({});

const foo = 'Foo';

var foo$1 = /*#__PURE__*/Object.freeze({
  foo: foo
});

const bar = 'Bar';

var bar$1 = /*#__PURE__*/Object.freeze({
  bar: bar
});

var index = {
  a, b, c, foo: foo$1, bar: bar$1
};

module.exports = index;
