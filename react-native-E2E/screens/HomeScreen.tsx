import { useContext } from "react";

import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import AppName from "../components/AppName";

import theme from "../theme";

import { AuthSettingsContext } from "../providers/AuthSettings";

export default function HomeScreen({ navigation }) {
  const authSettingsContext = useContext(AuthSettingsContext);

  const { unloadUserSettings } = authSettingsContext;

  return (
    <SafeAreaView style={theme.container}>
      <AppName />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={theme.button}
          onPress={() => {
            navigation.navigate("CarListScreen");
          }}
        >
          <Text style={theme.buttonText}>Car List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={theme.button}
          onPress={() => {
            navigation.navigate("PictureTakingScreen");
          }}
        >
          <Text style={theme.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={theme.button}
          onPress={() => {
            navigation.navigate("ImageGalleryScreen");
          }}
        >
          <Text style={theme.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={theme.button}
          onPress={() => {
            unloadUserSettings();
          }}
        >
          <Text style={theme.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <StatusBar />
    </SafeAreaView>
  );
}
