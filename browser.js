'use strict';

var lib = require('./lib');

async function getHmac(rawKey, counterBytes) {
  var key = await window.crypto.subtle.importKey(
    'raw', // raw format of the key - should be Uint8Array
    typeof rawKey === 'string'
      ? new TextEncoder('utf-8').encode(rawKey)
      : rawKey,
    {
      // algorithm details
      name: 'HMAC',
      hash: { name: 'SHA-1' },
    },
    false, // export = false
    ['sign', 'verify'] // what this key can do
  );

  var signature = await window.crypto.subtle.sign(
    'HMAC',
    key,
    Uint8Array.from(counterBytes)
  );

  return new Uint8Array(signature);
}

var _gen = lib.hotp.gen;
lib.hotp.gen = function(key, opt) {
  return _gen(key, opt, getHmac);
};

module.exports.hotp = lib.hotp;
module.exports.totp = lib.totp;
