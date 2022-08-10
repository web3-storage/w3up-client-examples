import { useContext, createContext, useState, useEffect } from 'react';
// import W3client from 'w3-up-client';
import W3client from '../lib/w3-up-client';
import { AuthSettingsContext } from './AuthSettings';

const W3_STORE_DID =
  process.env.W3_STORE_DID ||
  'did:key:z6MkrZ1r5XBFZjBU34qyD8fueMbMRkKw17BZaq2ivKFjnz2z';
const SERVICE_URL =
  process.env.SERVICE_URL ||
  'https://mk00d0sf0h.execute-api.us-east-1.amazonaws.com/';
//   'https://hgapw4sftk.execute-api.us-east-1.amazonaws.com';

async function BuildUploader(settings) {
  if (!settings || !settings.has('email')) {
    return null;
  }

  try {
    const uploader = new W3client({
      settings,
      serviceURL: SERVICE_URL,
      serviceDID: W3_STORE_DID,
    });
    return uploader;
  } catch (err) {
    console.log('wee', err);
  }

  return null;
}

const UploaderContext = createContext(null);

export function UploaderProvider({ children }) {
  const { settings } = useContext(AuthSettingsContext);
  const [uploader, setUploader] = useState(null);

  useEffect(() => {
    if (settings && !uploader) {
      BuildUploader(settings).then(setUploader);
    }
  }, [settings, uploader]);

  return (
    <UploaderContext.Provider value={uploader}>
      {children}
    </UploaderContext.Provider>
  );
}

export function useUploader() {
  return useContext(UploaderContext);
}
