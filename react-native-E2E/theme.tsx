import { ThemeProvider } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  logo: {
    width: 100,
    height: 100,
    margin: 25,
  },
  title: {
    fontSize: 46,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 24,
    textAlign: "center",
  },
  button: {
    padding: 12,
    margin: 8,
    borderRadius: 4,
    backgroundColor: "#252525",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  cameraControlPanel: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
  },
});

export default theme;
