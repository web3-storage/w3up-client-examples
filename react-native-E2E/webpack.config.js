const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
    },
    argv
  );

  config.resolve.alias = {
    ...config.resolve.alias,
    '@ucanto/core/link': path.resolve(
      __dirname,
      'node_modules/w3-up-store/node_modules/@ucanto/core/src/link'
    ),
    '@ucanto/transport/cbor': path.resolve(
      __dirname,
      'node_modules/w3-up-store/node_modules/@ucanto/transport/src/cbor'
    ),
    '@ucanto/transport/http': path.resolve(
      __dirname,
      'node_modules/w3-up-store/node_modules/@ucanto/transport/src/http'
    ),
  };

  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['babel-preset-expo'],
          plugins: [
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-optional-chaining',
            //             [
            //               'babel-plugin-rewrite-module-path',
            //               {
            //                 rewriteMapper: {
            //                   '^@ucanto/transport/cbor': '@ucanto/transport/src/cbor',
            //                 },
            //               },
            //             ],
          ],
        },
      },
    ],
    //     include: [path.resolve(__dirname, './node_modules/w3up_client')],
    exclude:
      /node_modules\/(?!(w3-up-.*|@ucanto|w3\-store|@web3\-storage|@web\-std).*\/).*/,
  });

  return config;
};
