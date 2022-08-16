import 'web-streams-polyfill'
import * as UnixFS from '@ipld/unixfs'
import * as CarBufferWriter from './w3-up-store/patches/@ipld/car/buffer-writer'

const CAPACITY = 1048576 * 32

// TODO: Pass bytes instead.
async function fileToBlock({ writer, filename, bytes }) {
  // make file writer, write to it, and close it to get link/cid
  const file = UnixFS.createFileWriter(writer)
  //   file.write(new TextEncoder().encode('hello world'));
  file.write(bytes)
  const fileLink = await file.close()

  return {
    name: filename,
    link: fileLink,
  }
}

async function wrapFilesWithDir({ writer, files }) {
  const dir = UnixFS.createDirectoryWriter(writer)
  files.forEach((file) => dir.set(file.name, file.link))
  const dirLink = await dir.close()

  return {
    name: '',
    link: dirLink,
  }
}

async function createReadableBlockStreamWithWrappingDir() {
  // Create a redable & writable streams with internal queue that can
  // hold around 32 blocks
  const { readable, writable } = new TransformStream(
    {},
    UnixFS.withCapacity(CAPACITY)
  )

  // Next we create a writer with filesystem like API for encoding files and
  // directories into IPLD blocks that will come out on `readable` end.
  const writer = UnixFS.createWriter({ writable })

  const file = await fileToBlock({
    writer,
    filename: 'test.md',
    //TODO: get bytse from somehwere else
    bytes: new TextEncoder().encode('hello world, this is a test'),
  })
  const dir = await wrapFilesWithDir({ writer, files: [file] })

  // close the writer to close underlying block stream.
  writer.close()

  // return the root and the readable stream.
  return {
    cid: dir.link.cid,
    readable,
  }
}

export async function createCar() {
  console.log('creating car')
  const { cid, readable } = await createReadableBlockStreamWithWrappingDir()
  var reader = readable.getReader()

  const buffer = new ArrayBuffer(CAPACITY)
  var bw = CarBufferWriter.createWriter(buffer, {
    roots: [cid],
  })

  await reader.read().then(function emitBlock({ done, value }) {
    if (!done) {
      bw.write(value)
      //TODO: detect when buffer overrun, and create new writer,
      //linking new car to prev
      return reader.read().then(emitBlock)
    }
  })

  console.log('closing')
  return bw.close({ resize: true })
}
