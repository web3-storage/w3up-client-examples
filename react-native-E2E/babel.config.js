module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-async-generator-functions',
      [
        'module-resolver',
        {
          '@ucanto/core/link': '@ucanto/core/src/link',
          '@ucanto/transport/http': '@ucanto/transport/src/http',
          '@ucanto/transport/cbor': '@ucanto/transport/src/cbor',
        },
      ],
    ],
  };
};
