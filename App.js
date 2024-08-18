import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import StackNavigator from "./StackNavigator";
import React from "react";
import {
	MD3LightTheme as DefaultTheme,
	PaperProvider,
} from "react-native-paper";
const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		// primary: "tomato",
		// secondary: "yellow",
	},
};

export default function App() {
	return (
		<PaperProvider theme={theme}>
			<StatusBar>hi</StatusBar>
			<StackNavigator />
		</PaperProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
