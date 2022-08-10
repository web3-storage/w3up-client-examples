import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import CarList from "./../components/CarList";
import ID from "./../components/ID";

import theme from "../theme";

export default function CarListScreen({ navigation }) {
  return (
    <SafeAreaView style={theme.container}>
      <ID />
      <CarList />
    </SafeAreaView>
  );
}
