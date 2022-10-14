import fs from "fs";
import path from "path";

import { createClient } from "@web3-storage/w3up-client";
import { packToBlob } from "ipfs-car/pack/blob";

const SETTINGS_FILENAME = "settings.json";

async function main() {
  const args = process.argv.slice(2);
  // Bail out if we have an unexpected number of arguments
  if (args.length !== 1) {
    const scriptPath = path.relative(process.cwd(), process.argv[1]);
    console.error(`usage: node ${scriptPath} <filename>`);
    process.exit(1);
  }

  const settings = await loadIdentity();
  const client = createClient({ settings });

  const { agent, account } = await client.identity();
  console.log(`Uploading as ${account.did()} with (${agent.did()})`);

  const filename = args[0];
  const { rootCID, carBytes } = await prepareForUpload(filename);
  console.log(`Uploading ${filename}`);
  console.log(`Root CID: ${rootCID}\n`);

  try {
    await client.upload(carBytes);
    console.log("🎉 Upload complete!");
    const gatewayURL = `https://w3s.link/ipfs/${rootCID}`;
    console.log(`🔗 View on an IPFS <-> HTTP gateway at ${gatewayURL}`);
  } catch (err) {
    console.error(`🧨 Upload failed with an error: ${err}`);
  }
}

async function loadIdentity() {
  if (!fs.existsSync(SETTINGS_FILENAME)) {
    const registerScriptPath = path.relative(process.cwd(), "register.js");
    console.log("No settings file named: " + SETTINGS_FILENAME);
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
 * @param {string} filename - the path to a local file to be uploaded
 * @returns {Promise<{ rootCID: string, carBytes: Uint8Array }>}
 */
async function prepareForUpload(filename) {
  const content = fs.createReadStream(filename);
  const fileBasename = path.basename(filename);
  const file = { content, path: fileBasename };
  const { root, car } = await packToBlob({
    input: [file],
  });
  const buf = await car.arrayBuffer();
  const carBytes = new Uint8Array(buf);
  const rootCID = root.toString();
  return { rootCID, carBytes };
}

main();
