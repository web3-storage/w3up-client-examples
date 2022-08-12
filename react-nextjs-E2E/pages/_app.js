import '../styles/globals.css';
import '../styles/dropzone.css';
import '../styles/code.css';

import { AuthSettingsProvider } from '../providers/AuthSettings.js';
import { UploaderProvider } from '../providers/Uploader.js';

function MyApp({ Component, pageProps }) {
  return (
    <AuthSettingsProvider>
      <UploaderProvider>
        <Component {...pageProps} />
      </UploaderProvider>
    </AuthSettingsProvider>
  );
}

export default MyApp;
