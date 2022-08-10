import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useUploader } from '../../providers/Uploader';

import { createWriter } from '../../lib/w3-up-store/patches/@ipld/car/buffer-writer.js';
//
// import { packToBlob } from 'ipfs-car/dist/esm/pack/blob.js';
import * as pack from 'ipfs-car/dist/esm/pack/index.js';

// import { CarReader, CarWriter } from '@ipld/car';
// import * as raw from 'multiformats/codecs/raw';
// import { CID } from 'multiformats/cid';
// import { sha256 } from 'multiformats/hashes/sha2';

// async function* asyncGen() {
//   yield 'whatever';
// }

async function buildCar(input) {
  console.log('wee', pack);
  const bytes = new TextEncoder().encode('hello world, this is a test');
  const { root, car } = await pack.pack({
    input: Buffer.from(bytes),
  });
  return [];
}

export default function UploadTestButton() {
  const [car, setCar] = useState(null);

  useEffect(() => {
    buildCar()
      .then((data) => {
        console.log('built a car');
      })
      .catch((err) => {
        console.log('failed building a car:', err);
      });
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        console.log('you pressed the button');
      }}
    >
      <Text style={styles.buttonText}>Upload</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
  },
  button: {
    width: 130,
    borderRadius: 4,
    backgroundColor: '#115aeb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

//
//   // Initiate the source
//   var bufferStream = new PassThrough();
//
//   // Write your buffer
//   bufferStream.end(bytes);
//
//   //   console.log('hello', PassThrough);
//   //   const foo = new Readable();
//
//   //   console.log(bufferStream);
//
//   // Where the blocks will be stored
//   const blockstore = new MemoryBlockstore();
//
//   // Import path /tmp/foo/bar
//   const source = [
//     {
//       path: '/fake',
//       content: bufferStream,
//     },
//   ];
//
//   const options = {
//     wrapWithDirectory: true,
//   };
//
//   let next = importer(source, blockstore, options);
//   const entries = [];
//
//   for await (const entry of importer(source, blockstore, options)) {
//     console.info(entry);
//   }

//   const bytes = new TextEncoder().encode('hello world, this is a test');
//   console.log(bytes);
//
//   var foo = new MemoryBlockStore();
//   for await (const block of foo.blocks()) {
//     console.log('wee', block);
//   }
//
//   try {
//     const packed = await pack({
//       input: [bytes],
//       blockstore: foo,
//       wrapWithDirectory: true, // Wraps input into a directory. Defaults to `true`
//       maxChunkSize: 262144, // The maximum block size in bytes. Defaults to `262144`. Max safe value is < 1048576 (1MiB)
//     });
//   } catch (error) {
//     console.log('error', error.stack);
//   }
//   const hash = await sha256.digest(raw.encode(bytes);
//   const cid = CID.createV1(raw.code, hash);

//   const headerBytes = new TextEncoder().encode('why is this breaking');
//   const headerHash = await sha256.digest(headerBytes);
//   const headerCid = CID.createV1(raw.code, headerHash);
//
// console.log('hash', hash);
// console.log('cid', cid.toString());

//   var all = new Uint8Array(headerBytes.byteLength + bytes.byteLength);
//   all.set(headerBytes);
//   all.set(bytes, headerBytes.byteLength);
//   const buffer = Buffer.from(bytes);
//
//   const writer = createWriter(buffer, { roots: [headerCid] });
//   console.log('writer', writer);
//   const car = writer.close({ resize: true });
