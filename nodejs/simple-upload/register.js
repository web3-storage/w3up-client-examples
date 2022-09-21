/// This script will create a new "identity" keypair and register it with the w3up Access service.
/// It produces a `settings.json` file containing the registered email address and the secret key.
///
/// You'll need the `settings.json` file in order to upload files. If you already have a registered
/// keypair using [w3up-cli](https://github.com/web3-storage/w3up-cli), you can create the `settings.json`
/// file using `w3up-cli export-settings` instead of using this script.


import { createClient } from 'w3up-client'

import fs from 'fs'
import path from 'path'

/// For simplicity, we always write to `settings.json` in the current directory
const OUTPUT_FILENAME = 'settings.json'

async function main() {
  /// To keep things simple, we just bail out if the output file exists rather than prompt to overwrite, etc.
  if (fs.existsSync(OUTPUT_FILENAME)) {
    console.error(`Output file ${OUTPUT_FILENAME} exists. Please move it elsewhere and try again.`)
    process.exit(1)
  }

  /// We take a single command line argument (the email to register)
  if (process.argv.length !== 3) {
    const scriptFile = path.relative(process.cwd(), process.argv[1])
    console.error(`usage: node ${scriptFile} <email-address>`)
    process.exit(1)
  }
  const email = process.argv[2]

  /// - Create a new w3up client
  const client = createClient({
    serviceDID: 'did:key:z6MkrZ1r5XBFZjBU34qyD8fueMbMRkKw17BZaq2ivKFjnz2z',
    serviceURL: 'https://8609r1772a.execute-api.us-east-1.amazonaws.com',
    accessDID: 'did:key:z6MkkHafoFWxxWVNpNXocFdU6PL2RVLyTEgS1qTnD3bRP7V9',
    accessURL: 'https://access-api.web3.storage',
    settings: new Map(),
  })

  /// - Call client.register
  try {
    console.log(`Registering email address ${email}. Please check your inbox. If you don't see the email, check your spam folder.`)
    const id = await client.identity()
    await client.register(email)
    
    console.log(`Success! Registered email ${email} with id ${id.did()}`)
    /// - On success, call saveSettings to write settings.json
    await saveSettings(client.settings)
  } catch (err) {
    console.error(`Registration error: ${err}`)
    process.exit(1)
  }
}


/**
 * Saves the identity settings to a JSON file.
 * 
 * @param {Map<string, unknown>} settings 
 */
async function saveSettings(settings) {
  const email = settings.get('email')
  const secret = settings.get('secret')
  if (!email || !settings) {
    throw new Error(`unable to save settings: no registered id`)
  }

  const buf = Buffer.from(secret)
  const secretBase64 = buf.toString('base64')
  const jsonText = JSON.stringify({
    email,
    secret: secretBase64
  })
  await fs.promises.writeFile(OUTPUT_FILENAME, jsonText, 'utf-8')
}


/// call the entry point function:
main()