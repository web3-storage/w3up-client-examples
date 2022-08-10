import "./shim.js";

import { useState } from "react";

import { ImagesContextProvider, ImagesContext } from "./providers/Images";

import { UploaderProvider } from "./providers/Uploader";
import { AuthSettingsProvider } from "./providers/AuthSettings";

import { RootNavigation } from "./navigation/RootNavigation";

export default function App() {
  return (
    <AuthSettingsProvider>
      <UploaderProvider settings={{}}>
        <ImagesContextProvider>
          <RootNavigation />
        </ImagesContextProvider>
      </UploaderProvider>
    </AuthSettingsProvider>
  );
}
