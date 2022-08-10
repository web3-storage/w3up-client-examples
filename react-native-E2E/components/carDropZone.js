import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploader } from '../providers/Uploader';

async function fileToBytes(file) {
  return new Promise((resolve, reject) => {
    //     var reader = new FileReader();
    //     let array;
    //     reader.readAsArrayBuffer(file);
    //     reader.onloadend = function (evt) {
    //       if (evt.target.readyState == FileReader.DONE) {
    //         var arrayBuffer = evt.target.result,
    //           array = new Uint8Array(arrayBuffer);
    //       }
    //
    //       resolve(array);
    //     };
  });
}

export default function CarDropzone({ onUploaded }) {
  const uploader = useUploader();
  const onDrop = useCallback(async (acceptedFiles) => {
    const fileBytes = await fileToBytes(acceptedFiles[0]);
    const res = await uploader.upload(fileBytes);
    onUploaded && onUploaded(res);
  }, []);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      car: ['.car'],
    },
  });

  if (uploader == null) {
    return null;
  }

  let text = <p>Drag 'n' drop some files here, or click to select files</p>;
  let className = 'dropzone hologram interactive';

  if (isDragActive) {
    className = `${className} active`.trim();
    text = <p>Drop Files here</p>;
  }

  if (isDragReject) {
    className = `${className} reject`.trim();
    text = <p>File must be a CAR file</p>;
  }

  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      {text}
    </div>
  );
}
