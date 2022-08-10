# W3up React Native E2E

This project is a standing example for verifying functionality of the use of the W3up React Provider loacated in the [w3up-client-components](https://github.com/nftstorage/w3up-client-components) repository, which implements the [w3-up client](https://github.com/nftstorage/w3up-client) when it has been imported into the React Native environment, in an Expo-ready project.

This project, when completed and run should allow the user to:

- Log in and out, do auth
- Create files and upload them to w3up
- Get uploaded files for the user
- Get information via the w3query

# React Native and Expo

The project was created via Expo, and runs in a React Native environment. You'll need to do the usual steps involved in an Expo project, such as downloading the Expo application for your device.

Some valuable links:

- [The Expo Documentation](https://docs.expo.dev/)
- [Expo Installtion](https://docs.expo.dev/get-started/installation/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [The Metro Bundler](https://facebook.github.io/metro/)

# Up and Running

0. Make sure you have these:

   1. Git
   2. Node
   3. OSX/Linux : [watchman](https://facebook.github.io/watchman/docs/install#buildinstall)
   4. A phone

1. Get the Expo App for your phone

   - [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&gl=US)
   - [IOS App Store](https://apps.apple.com/us/app/expo-go/id982107779)

2. Get the [Expo Cli](https://www.npmjs.com/package/expo-cli) and Log In to Expo.

   1. Verify CLI and Login
      - install: `npm install -g expo-cli`
      - verify: `expo --version` => (6.0.1)
      - register if you aren't `expo register`
      - verify login: `expo whoami` => (the-simian)
   2. You can also use these for account management
      - Expo Account Services: [EAS CLI](https://docs.expo.dev/build/setup/#1-install-the-latest-eas-cli)
      - The Expo.dev [website](https://expo.dev/login)

3. `yarn install` and `expo install`

4. **Important!** Now you need to patch the project _after_ installation. This will almost certainly change in the future, but as of Aug 10 2022:

   - run `path.sh`.
   - This will copy some necessary files into your node_modules from the patches directory (auth, validator, signer)

5. You can now run the project: `yarn start`. This will begin the bundler and start the debugger. Get Expo running on your phone too. This will get the bundles from the dev service that just started

