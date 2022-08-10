import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Logo from "../components/Logo";
import theme from "../theme";
export default function AppName() {
  return (
    <View
      style={{
        flex: 1,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={theme.title}>W3 Up</Text>
      <Logo style={theme.logo} />
      <Text style={theme.subTitle}>E2E Example Application</Text>
    </View>
  );
}
