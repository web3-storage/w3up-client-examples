import 'node-libs-expo/globals';

if (typeof BigInt === 'undefined')
  global.BigInt = require('./patches/big-integer');
// import 'react-native-randombytes';
// import 'react-native-crypto';
import 'fastestsmallesttextencoderdecoder';
import 'react-native-url-polyfill/auto';

import * as Random from 'expo-random';
import crypto1 from 'isomorphic-webcrypto';
import crypto2 from 'react-native-expo-crypto';
import hex from 'hex-lite';
// const crypto3 = require('expo-crypto');

// console.log('what', crypto1);
// console.log('what', crypto2);

const crypto = { ...crypto1, ...crypto2 };
// const crypto = { ...crypto2 };

const test =
  '0x63392029acc126ae4e96098f9b0060c652f22955438b9a89300af3117c03a1c8';

const foo = BigInt(test);

crypto.getRandomValues = async function getRandomValues(arr) {
  await crypto.ensureSecure();
  //   console.log('getting random');
  if (arr.byteLength != arr.length) {
    // Get access to the underlying raw bytes
    arr = new Uint8Array(arr.buffer);
  }
  //   console.log('getting random');
  const bytes = await Random.getRandomBytesAsync(arr.length);
  for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes[i];
  }
  return arr;
};

const ensureSecureBeforePatch = crypto.ensureSecure;
crypto.ensureSecure = async (args) => {
  global.crypto = crypto;
  console.log(
    'If you see this, you should be able to ignore warning, as crypto was patched.'
  );
  await ensureSecureBeforePatch();
};

function ensureUint8Array(buffer) {
  if (typeof buffer === 'string' || buffer instanceof String)
    return str2buf.toUint8Array(buffer);
  if (!buffer) return;
  if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
  if (buffer instanceof Uint8Array) return buffer;
  return buffer;
}

const originalDigest = crypto.subtle.digest;
crypto.subtle.digest = async function digest() {
  if (typeof arguments[0] == 'string') {
    arguments[0] = { name: arguments[0] };
  }
  arguments[1] = ensureUint8Array(arguments[1]);
  arguments[1] = Buffer.from(arguments[1]);

  return originalDigest.apply(this, arguments);
};

crypto.ensureSecure().then((val) => {
  crypto.getRandomValues([0]).then((vals) => {
//     crypto.subtle
//       .digest({ name: 'SHA-512' }, new Uint8Array([1, 2, 3]).buffer)
//       .then((hash) => {
//         // hashes are usually represented as hex strings
//         // hex-lite makes this easier
//         const hashString = hex.fromBuffer(hash);
//         console.log('hashed string', hashString);
//       });
  });
});

// Shim FileReader.readAsArrayBuffer
// https://github.com/facebook/react-native/issues/21209
try {
  var fr = new FileReader();
  try {
    fr.readAsArrayBuffer(new Blob(['hello'], { type: 'text/plain' }));
  } catch (error) {
    FileReader.prototype.readAsArrayBuffer = function (blob) {
      if (this.readyState === this.LOADING) {
        throw new Error('InvalidStateError');
      }
      this._setReadyState(this.LOADING);
      this._result = null;
      this._error = null;
      var fr = new FileReader();
      fr.onloadend = () => {
        var content = atob(fr.result.split(',').pop().trim());
        var buffer = new ArrayBuffer(content.length);
        var view = new Uint8Array(buffer);
        view.set(Array.from(content).map((c) => c.charCodeAt(0)));
        this._result = buffer;
        this._setReadyState(this.DONE);
      };
      fr.readAsDataURL(blob);
    };
  }
} catch (error) {
  console.log('Missing FileReader; unsupported platform');
}
