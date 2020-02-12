'use strict';

// dependencies
var uuid = require('uuid');
var baseX = require('base-x');
var base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

// expose uuid and baseX for convenience
module.exports.uuid = uuid;
module.exports.baseX = baseX;
module.exports.base62 = base62;
module.exports.length = 22;
module.exports.uuidLength = 32;


/**
 * v1
 */
module.exports.v1 = function () {
  return this.encode(uuid.v1.apply(null, arguments));
};

/**
 * v3
 */
module.exports.v3 = function () {
  return this.encode(uuid.v3.apply(null, arguments));
};

/**
 * v4
 */
module.exports.v4 = function () {
  return this.encode(uuid.v4.apply(null, arguments));
};

/**
 * v5
 */
module.exports.v5 = function () {
  return this.encode(uuid.v5.apply(null, arguments));
};

/**
 * encode
 */
module.exports.encode = function encode(input, options) {
  options = options || {};

  // Make compatible with previous API.
  options.encoding = typeof options === 'string' ?
    options
  : options.encoding || 'hex';

  options.base = options.base || this.customBase;
  options.length = options.length || module.exports.length;

  if (typeof input === 'string') {
    // remove the dashes to save some space
    input = new Buffer(input.replace(/-/g, ''), options.encoding);
  }
  return ensureLength(options.base.encode(input), options.length);
};

/**
 * decode
 */
module.exports.decode = function decode(b62Str, options) {
  options = options || {};

  // Make compatible with previous API.
  options.encoding = typeof options === 'string' ?
    options
  : options.encoding || 'hex';

  options.base = options.base || this.customBase;
  options.length = options.length || module.exports.uuidLength;

  var res = ensureLength(new Buffer(options.base.decode(b62Str)).toString(options.encoding), options.length);

  // re-add the dashes so the result looks like an uuid
  var resArray = res.split('');
  [8, 13, 18, 23].forEach(function(idx){
    resArray.splice(idx, 0, '-');
  });
  res = resArray.join('');

  return res;
};

/**
 * ensureLength
 *
 * @api private
 */
function ensureLength(str, maxLen){
  str = str + "";
  if(str.length < maxLen){
    return padLeft(str, maxLen);
  }
  else if (str.length > maxLen){
    return trimLeft(str, maxLen);
  }
  return str;
};


/**
 * padLeft
 *
 * @api private
 */
function padLeft(str, padding){
  str = str + "";
  var pad = "";
  for(var i=str.length; i<padding; i++){
    pad += '0';
  }
  return pad + str;
};

/**
 * trimLeft
 *
 * @api private
 */
function trimLeft(str, maxLen){
  str = str + "";
  var trim = 0;
  while(str[trim] === '0' && (str.length - trim) > maxLen){
    trim++;
  }
  return str.slice(trim);
};
