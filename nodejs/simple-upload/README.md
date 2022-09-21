# simple-client

> A nodejs command-line example of using the w3up-client SDK to upload to the Web3.Storage platform.

This example shows how to use the [w3up-client](https://github.com/web3-storage/w3up-client) library to upload files to the [Web3.Storage](https://web3.storage) platform.

If you're looking for a fully-featured command line tool, please see [w3up-cli][] instead. This example is intentionally minimal for demonstration purposes.

Note that this example works best with small files, as it uses a fairly simplistic method of generating CAR files for upload. The more advanced CAR generation code in [w3up-cli][] will soon be incorporated into the `w3up-client` package, at which point this example will be usable for large files. Until then, please use [w3up-cli][] for large files. If you need the advanced CAR chunking in a JS app today, please open an issue and let us know.

## Usage

First, install the package dependencies:

```sh
npm install
```

Now you can run the `upload.js` script:

```sh
node upload.js
```

This should print a message asking for a filename to upload:

```
usage: node upload.js <filename>
```

### Registration

If you try uploading a file now, you should expect to see a message similar to this:

```
To upload files, you first need to create an identity key and register it.
This example script expects to load the key from a file named settings.json

There are two ways to create the settings.json file:

1) using the register.js script in this directory:

	node register.js your-email@provider.net

2) using an identity you've already registered with w3up-cli (https://github.com/web3-storage/w3up-cli)

	w3up-cli export-settings settings.json
```

As you can see, the `upload.js` script expects to load a key from a file named `settings.json` in the
current directory. If it doesn't exist, it will give you a couple of options.

If you've already been using [`w3up-cli`](https://github.com/web3-storage/w3up-cli), you can export your identity key using the `export-settings` command.

Alternatively, you can run `node register.js your-email-here@example.com` to create and register a new identity.

### Upload

Once you have a `settings.json` file with a registered key, you can call the upload script, passing in the path to a file:

```sh
node upload.js path-to-your-file
```

You should see something like this:

```
Uploading as did:key:z6MknWAmtEVoteNAMszWVS2CVKCA6ub6ieU9Hfjmp6369Ut7 (yusef@dag.house)
Uploading README.md
Root CID: bafybeifubfw55lw66ztzdug26zocmwsylguxhurmryltbqnql5zwznkvpy

🎉 Upload complete!
🔗 View on an IPFS <-> HTTP gateway at https://w3s.link/ipfs/bafybeifubfw55lw66ztzdug26zocmwsylguxhurmryltbqnql5zwznkvpy
Note that it may take a few seconds before content is available.
```

[w3up-cli]: https://github.com/web3-storage/w3up-cli
