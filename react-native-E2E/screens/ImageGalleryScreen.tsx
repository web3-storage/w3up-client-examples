import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import GalleryViewer from "../components/GalleryViewer";
import { StatusBar } from "expo-status-bar";
import theme from "../theme";
export default function ImageGalleryScreen({ navigation }) {
  const navigateToCamera = () => navigation.navigate("Camera");

  return (
    <SafeAreaView style={theme.container}>
      <GalleryViewer uploader={{}} navigateToCamera={navigateToCamera} />
      <StatusBar />
    </SafeAreaView>
  );
}
