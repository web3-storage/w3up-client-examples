import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import PictureTaker from "../components/PictureTaker";

import theme from "../theme";

export default function PictureTakingScreen({ navigation }) {
  const navigateToGallery = () => navigation.navigate("ImageGalleryScreen");
  return (
    <SafeAreaView style={theme.container}>
      <PictureTaker uploader={{}} navigateToGallery={navigateToGallery} />
      <StatusBar />
    </SafeAreaView>
  );
}
