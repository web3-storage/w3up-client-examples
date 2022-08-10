import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AnimatedGallery from "react-native-animated-gallery";
import { useWindowDimensions } from "react-native";

import { ImagesContext } from "../providers/Images";

export default function GalleryViewer({ uploader, navigateToCamera }) {
  const imagesContext = useContext(ImagesContext);

  const { images } = imagesContext;

  return (
    <View>
      <AnimatedGallery imageUrls={images} />
      {/* <Text>{`Images ${images.map((images) => images.url)}`}</Text> */}
    </View>
  );
}
