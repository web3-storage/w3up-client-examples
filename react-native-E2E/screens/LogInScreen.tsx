import { useContext } from "react";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Logo from "../components/Logo";
import theme from "../theme";

import { AuthSettingsContext } from "../providers/AuthSettings";
import AppName from "../components/AppName";

export default function LogInScreen() {
  const authSettingsContext = useContext(AuthSettingsContext);

  const { loadUserSettings } = authSettingsContext;
  return (
    <SafeAreaView style={theme.container}>
      <AppName />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={theme.button}
          onPress={() => {
            loadUserSettings();
          }}
        >
          <Text style={theme.buttonText}>Log In (Load Settings)</Text>
        </TouchableOpacity>
      </View>
      <StatusBar />
    </SafeAreaView>
  );
}
