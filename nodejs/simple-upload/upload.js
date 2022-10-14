/// This example project aims to demonstrate how to integrate the `w3up-client` SDK
/// into a node command line app.
///
/// To keep the example focused, we'll be leaving a lot of things out that you'd
/// probably want to have in a "production-ready" application. For a real-world
/// CLI example, see https://github.com/web3-storage/w3up-cli

/// First we need to import the `createClient` function from the `w3up-client` package.
import { createClient } from "@web3-storage/w3up-client";

/// We also import the `packToBlob` function from the `ipfs-car` package, 
/// to create IPFS-formatted file objects and pack them into a Content Archive (CAR) for uploading. 
/// Note that this will likely be handled automatically by a future version of `w3up-client`.
import { packToBlob } from "ipfs-car/pack/blob";

/// Finally, we import a few things from the node standard library
import fs from "fs";
import path from "path";

/// In this example, we always load the identity key from a `settings.json` file
/// in the current directory. See the `loadSettings` function below.
const SETTINGS_FILENAME = "settings.json";

/**
 * The entry-point function is invoked at the bottom of this file.
 */
async function main() {
  // To keep things super simple, we only support a single command line argument: the path to a file.
  // We need to slice off the first two elements of process.args, which contain the nodejs command and path to the script file.
  const args = process.argv.slice(2);

  // Bail out if we have an unexpected number of arguments
  if (args.length !== 1) {
    const scriptPath = path.relative(process.cwd(), process.argv[1]);
    console.error(`usage: node ${scriptPath} <filename>`);
    process.exit(1);
  }

  const filename = args[0];

  // Load the secret key from a local settings.json file.
  // If it does not exist, `loadIdentity` will prompt the user to
  // register an identity using the `register.js` script.
  const settings = await loadIdentity();

  // create a new w3up client using the secret key
  const client = createClient({ settings });

  // client.identity() returns an object we can use to print the `did:key:`
  // string that is used as our public identity.
  const { agent, account } = await client.identity();
  console.log(`Uploading as ${account.did()} with (${agent.did()})`);

  const { rootCID, carBytes } = await prepareForUpload(filename);
  console.log(`Uploading ${filename}`);
  console.log(`Root CID: ${rootCID}\n`);

  try {
    await client.upload(carBytes);
    console.log("🎉 Upload complete!");

    const gatewayURL = `https://w3s.link/ipfs/${rootCID}`;
    console.log(`🔗 View on an IPFS <-> HTTP gateway at ${gatewayURL}`);
    console.log(
      "Note that it may take a few seconds before content is available."
    );
  } catch (err) {
    console.error(`🧨 Upload failed with an error: ${err}`);
  }
}

/**
 * Loads the identity key and registered email address from a `settings.json` file in the current directory.
 * If the file does not exist, prints an error message and exits the process.
 *
 * @returns {Promise<string>} an object containing the secret key and registered email address
 */
async function loadIdentity() {
  if (!fs.existsSync(SETTINGS_FILENAME)) {
    const registerScriptPath = path.relative(process.cwd(), "register.js");

    const msg = `
      To upload files, you first need to create an identity key and register it.
      This example script expects to load the key from a file named ${SETTINGS_FILENAME}

      There are two ways to create the settings.json file:
      
      1) using the register.js script in this directory:

      \t node ${registerScriptPath} your-email@provider.net

      2) using an identity you've already registered with w3up-cli (https://github.com/web3-storage/w3up-cli)

      \t w3up-cli export-settings settings.json
    `.replace(/^ +/gm, ""); // strip leading spaces from each line, but keep tabs

    console.error(msg);
    process.exit(1);
  }

  try {
    return await fs.promises.readFile(SETTINGS_FILENAME, "utf-8");
  } catch (err) {
    console.error("Error parsing secret key from settings file:", err);
    process.exit(1);
  }
}

/**
 * Takes the path to a file and creates a CAR with a an IPFS (UnixFS) formatted file object, wrapped in a directory so that we can preserve the filename.
 *
 * @param {string} filename - the path to a local file to be uploaded
 *
 * @returns {Promise<{ rootCID: string, carBytes: Uint8Array }>}
 */
async function prepareForUpload(filename) {
  // ipfs-car accepts several types of "file-like" data.
  // We're using the `ToFile` type, which expects an object with `path` and `content` fields:
  // https://github.com/ipfs/js-ipfs/blob/89aeaf8e25320276391653104981e37a73f29de9/packages/ipfs-core-types/src/utils.ts#L30

  // The `content` field can be a `ReadableStream<Uint8Array>`, which is conveniently what's returned by [`fs.createReadStream`](https://nodejs.org/api/fs.html#fscreatereadstreampath-options)
  const content = fs.createReadStream(filename);

  // Since our `filename` may contain the full path to a file, we use [`path.basename`](https://nodejs.org/api/path.html#pathbasenamepath-ext)
  // to get just the filename part of the path to use when packing the CAR.
  const fileBasename = path.basename(filename);

  // The `file` object below now has the fields that ipfs-car expects for its `input` argument.
  const file = { content, path: fileBasename };

  const { root, car } = await packToBlob({
    // we need to pass an iterable (in this case, an array), even when packing a single file
    input: [file],
  });

  // packToBlob returns a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob), but we want
  // a `Uint8Array` to pass to the client's `upload` method.
  const buf = await car.arrayBuffer();
  const carBytes = new Uint8Array(buf);

  // root is a CID object, but we only need the string form for this example
  const rootCID = root.toString();
  return { rootCID, carBytes };
}

// call the entry-point function
main();

