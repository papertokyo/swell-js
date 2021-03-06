"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _require = require('./utils'),
    map = _require.map,
    reduce = _require.reduce,
    defaultMethods = _require.defaultMethods;

function methods(request) {
  return _objectSpread({}, defaultMethods(request, '/products', ['list', 'get']), {
    variation: calculateVariation
  });
}

function getProductOptionIndex(product) {
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (!product.options) {
    return {};
  }

  var productOptions = filter ? product.options.filter(filter) : product.options;
  return reduce(productOptions, function (acc, op) {
    var _objectSpread3;

    var values = reduce(op.values, function (acc, val) {
      var _objectSpread2;

      return _objectSpread({}, acc, (_objectSpread2 = {}, (0, _defineProperty2["default"])(_objectSpread2, val.id, _objectSpread({}, val, {
        id: val.id
      })), (0, _defineProperty2["default"])(_objectSpread2, val.name, _objectSpread({}, val, {
        id: val.id
      })), _objectSpread2));
    }, {});
    return _objectSpread({}, acc, (_objectSpread3 = {}, (0, _defineProperty2["default"])(_objectSpread3, op.id, _objectSpread({}, op, {
      values: values
    })), (0, _defineProperty2["default"])(_objectSpread3, op.name, _objectSpread({}, op, {
      values: values
    })), _objectSpread3));
  }, {});
}

function cleanProductOptions(options) {
  var result = options || [];

  if (options && (0, _typeof2["default"])(options) === 'object' && !(options instanceof Array)) {
    result = [];

    for (var key in options) {
      result.push({
        id: key,
        value: options[key]
      });
    }
  }

  if (result instanceof Array) {
    return result.map(function (op) {
      return {
        id: op.id || op.name,
        value: op.value
      };
    });
  }

  return result;
}

function getVariantOptionValueIds(product, options) {
  var cleanOptions = cleanProductOptions(options);
  var index = getProductOptionIndex(product, function (op) {
    return op.variant;
  });
  var optionValueIds = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = cleanOptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var option = _step.value;

      if (index[option.id] && index[option.id].values[option.value]) {
        optionValueIds.push(index[option.id].values[option.value].id);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return optionValueIds;
}

function findVariantWithOptionValueIds(product, ids) {
  if (ids.length > 0) {
    var variants = product.variants && product.variants.results;

    if (variants.length > 0) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = variants[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var variant = _step2.value;
          var matched = true;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = ids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var valueId = _step3.value;

              if (variant.option_value_ids && variant.option_value_ids.indexOf(valueId) === -1) {
                matched = false;
                break;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          if (matched) {
            return variant;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }

  return null;
}

function findVariantWithOptions(product, options) {
  var optionValueIds = getVariantOptionValueIds(product, options);
  return findVariantWithOptionValueIds(product, optionValueIds);
}

function calculateVariation(product, options) {
  var variation = _objectSpread({}, product, {
    price: product.price || 0,
    sale_price: product.sale_price,
    orig_price: product.orig_price,
    stock_status: product.stock_status
  });

  var optionPrice = 0;
  var variantOptionValueIds = [];
  var cleanOptions = cleanProductOptions(options);
  var index = getProductOptionIndex(product);
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = cleanOptions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var option = _step4.value;

      if (index[option.id] && index[option.id].values[option.value]) {
        if (index[option.id].variant) {
          variantOptionValueIds.push(index[option.id].values[option.value].id);
        } else {
          optionPrice += index[option.id].values[option.value].price || 0;
        }
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  if (variantOptionValueIds.length > 0) {
    var variant = findVariantWithOptionValueIds(product, variantOptionValueIds);

    if (variant) {
      variation.price = variant.price || 0;
      variation.sale_price = variant.sale_price || product.sale_price;
      variation.orig_price = variant.orig_price || product.orig_price;
      variation.stock_status = variant.stock_status || product.stock_status;
    }
  }

  if (optionPrice > 0) {
    variation.price += optionPrice;

    if (variation.sale_price) {
      variation.sale_price += optionPrice;
    }

    if (variation.orig_price) {
      variation.orig_price += optionPrice;
    }
  }

  if (variation.sale_price === undefined) {
    delete variation.sale_price;
  }

  if (variation.orig_price === undefined) {
    delete variation.orig_price;
  }

  return variation;
}

module.exports = {
  methods: methods,
  cleanProductOptions: cleanProductOptions,
  getProductOptionIndex: getProductOptionIndex,
  getVariantOptionValueIds: getVariantOptionValueIds,
  findVariantWithOptions: findVariantWithOptions,
  calculateVariation: calculateVariation
};