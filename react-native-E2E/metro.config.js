// const extraNodeModules = {
//   "@terrylinla/react-native-sketch-canvas":
//     "./node_modules/@terrylinla/react-native-sketch-canvas/",
// };

// const resolverMainFields = ["browser", "main"];

// module.exports = {
//   resolver: {
//     extraNodeModules,
//     resolverMainFields,
//   },
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
// };

module.exports = {
  resolver: {
    extraNodeModules: {
      ...require('node-libs-expo'),
//       stream: require.resolve('readable-stream'),
      '@ucanto/core/link': '@ucanto/core/src/link',
      '@ucanto/transport/cbor': '@ucanto/transport/src/cbor',
      '@ucanto/transport/http': '@ucanto/transport/src/http',
      'node_modules/w3up_client/@ucanto/core/link':
        'node_modules/w3up_client/@ucanto/core/src/link',
    },
  },
};
