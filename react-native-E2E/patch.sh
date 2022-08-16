#!/bin/sh

cp patches/signer.js ./node_modules/@ucanto/authority/src/signer.js
cp patches/authority.js ./node_modules/@ucanto/authority/src/authority.js
cp patches/link.js ./node_modules/@ucanto/validator/src/decoder/link.js
