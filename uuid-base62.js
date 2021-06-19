'use strict';

// dependencies
var baseX = require('base-x');
var Buffer = require('safe-buffer').Buffer;
var base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
var base16 = baseX('0123456789abcdef');

// expose uuid and baseX for convenience
module.exports.baseX = baseX;
module.exports.base16 = base16;
module.exports.customBase = base62;
module.exports.length = 22;
module.exports.uuidLength = 32;

/**
 * v1
 */
module.exports.v1 = function () {
  return this.encode(require('uuid').v1.apply(null, arguments));
};

/**
 * v3
 */
module.exports.v3 = function () {
  return this.encode(require('uuid').v3.apply(null, arguments));
};

/**
 * v4
 */
module.exports.v4 = function () {
  return this.encode(require('uuid').v4.apply(null, arguments));
};

/**
 * v5
 */
module.exports.v5 = function () {
  return this.encode(require('uuid').v5.apply(null, arguments));
};

/**
 * encode
 */
module.exports.encode = function encode(input, options) {
  options = options || {};

  options.base = options.base || this.customBase;
  options.length = options.length || this.length;

  if (typeof options.base === "string") {
    options.base = baseX(options.base);
  }

  if (typeof input === 'string') {
    // remove the dashes to save some space
    input = base16.decode(input.replace(/-/g, ''));
  }
  return ensureLength(options.base.encode(input), options.length);
};

/**
 * decode
 */
module.exports.decode = function decode(b62Str, options) {
  options = options || {};

  options.base = options.base || this.customBase;
  options.length = options.length || this.uuidLength;
  options.dashes = options.dashes !== undefined ? options.dashes : [8, 13, 18, 23];

  if (typeof options.base === "string") {
    options.base = baseX(options.base);
  }

  var res = options.base.decode(b62Str);

  if (typeof res === "string") {
    res = Buffer.from(res, 'ascii')
  }

  res = ensureLength(base16.encode(res), options.length);

  // re-add the dashes so the result looks like an uuid
  if (Array.isArray(options.dashes)) {
    var resArray = res.split('');
    options.dashes.forEach(function (idx) {
      resArray.splice(idx, 0, '-');
    });
    res = resArray.join('');
  }

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
}


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
}

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
}
