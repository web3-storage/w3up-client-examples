import React, { useState, useEffect, useRef, createContext } from "react";
import { Text } from "react-native";

const init = {
  images: [],
  addImage: (img) => {},
};

export const ImagesContext = createContext(init);

export function ImagesContextProvider({ children }) {
  const [images, setImages] = useState(init.images);

  const addImage = (img) => {
    if (img) {
      setImages([
        ...images.filter((img) => img.id !== img.uri),
        {
          id: img.uri,
          url: img.uri,
        },
      ]);
    }
  };

  const value = { images, addImage };

  return (
    <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
  );
}
