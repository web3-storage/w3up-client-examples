/// This script will create a new "identity" keypair and register it with the w3up Access service.
/// It produces a `settings.json` file containing the registered email address and the secret key.
///
/// You'll need the `settings.json` file in order to upload files. If you already have a registered
/// keypair using [w3up-cli](https://github.com/web3-storage/w3up-cli), you can create the `settings.json`
/// file using `w3up-cli export-settings` instead of using this script.

import { createClient, exportSettings } from "@web3-store/w3up-client";

import fs from "fs";
import path from "path";

/// For simplicity, we always write to `settings.json` in the current directory
const OUTPUT_FILENAME = "settings.json";

async function main() {
  /// To keep things simple, we just bail out if the output file exists rather than prompt to overwrite, etc.
  if (fs.existsSync(OUTPUT_FILENAME)) {
    console.error(
      `Output file ${OUTPUT_FILENAME} exists. Please move it elsewhere and try again.`
    );
    process.exit(1);
  }

  /// We take a single command line argument (the email to register)
  if (process.argv.length !== 3) {
    const scriptFile = path.relative(process.cwd(), process.argv[1]);
    console.error(`usage: node ${scriptFile} <email-address>`);
    process.exit(1);
  }
  const email = process.argv[2];

  /// - Create a new w3up client
  const client = createClient();

  /// - Call client.register
  try {
    console.log(
      `Registering email address ${email}. Please check your inbox. If you don't see the email, check your spam folder.`
    );
    const { agent, account } = await client.identity();
    await client.register(email);

    console.log(`Success! Registered email ${email} with id ${account.did()}`);
    /// - On success, call saveSettings to write settings.json
    await saveSettings(client.settings);
  } catch (err) {
    console.error(`Registration error: ${err}`);
    process.exit(1);
  }
}

/**
 * Saves the identity settings to a JSON file.
 *
 * @param {Map<string, unknown>} settings
 */
async function saveSettings(settings) {
  const exported = exportSettings(settings);
  const jsonText = JSON.stringify(exported);
  await fs.promises.writeFile(OUTPUT_FILENAME, jsonText, "utf-8");
}

/// call the entry point function:
main();
