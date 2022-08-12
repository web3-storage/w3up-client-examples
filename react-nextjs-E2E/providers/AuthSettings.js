import React, { createContext, useState, useEffect } from 'react';

import defaultSettings from '../secrets.json';

const init = {
  settings: new Map(),
  loadUserSettings: () => {},
  unloadUserSettings: () => {},
};

export const AuthSettingsContext = createContext(init);

export function AuthSettingsProvider({ children }) {
  const [settings, setSettings] = useState(init.settings);

  const loadUserSettings = () => {
    try {
      let parsed = defaultSettings;
      const secret = Uint8Array.from(Buffer.from(parsed.secret, 'base64'));

      const settingsDB = new Map();
      settingsDB.set('email', parsed.email);
      settingsDB.set('secret', secret);
      settingsDB.set('validated', parsed.validated);
      setSettings(settingsDB);
      console.log('set settings');
    } catch (err) {
      console.log(err);
    }
  };

  const unloadUserSettings = () => {
    setSettings(init.settings);
  };

  const value = { settings, loadUserSettings, unloadUserSettings };

  return (
    <AuthSettingsContext.Provider value={value}>
      {children}
    </AuthSettingsContext.Provider>
  );
}
