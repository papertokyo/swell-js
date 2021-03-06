const qs = require('qs');
const { normalizeKeys } = require('object-keys-normalizer');

function toCamel(obj) {
  return normalizeKeys(obj, 'camel');
}

function toSnake(obj) {
  if (!obj) return;
  // Make a copy to avoid mutating source object
  const objCopy = JSON.parse(JSON.stringify(obj));
  return normalizeKeys(objCopy, 'snake');
}

function trimBoth(str) {
  return trimStart(trimEnd(str));
}

function trimStart(str) {
  return typeof str === 'string' ? str.replace(/^[/]+/, '') : '';
}

function trimEnd(str) {
  return typeof str === 'string' ? str.replace(/[/]+$/, '') : '';
}

function stringifyQuery(str) {
  return qs.stringify(str, {
    depth: 10,
    encode: false,
  });
}

function map(arr, cb) {
  return arr instanceof Array ? arr.map(cb) : [];
}

function reduce(arr, cb, init) {
  return arr instanceof Array ? arr.reduce(cb, init) : init;
}

function isServer() {
  return !(typeof window !== 'undefined' && window.document);
}

function defaultMethods(request, uri, methods) {
  return {
    list:
      methods.indexOf('list') >= 0
        ? function(query) {
            return request('get', uri, undefined, query);
          }
        : undefined,

    get:
      methods.indexOf('get') >= 0
        ? function(id, query) {
            return request('get', uri, id, query);
          }
        : undefined,
  };
}

module.exports = {
  toCamel,
  toSnake,
  trimBoth,
  trimStart,
  trimEnd,
  stringifyQuery,
  isServer,
  map,
  reduce,
  defaultMethods,
};
