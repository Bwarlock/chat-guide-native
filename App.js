import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./StackNavigator";
import React from "react";
import {
	MD3LightTheme as DefaultTheme,
	PaperProvider,
} from "react-native-paper";
import { Provider } from "react-redux";
import store from "./store/store";
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
		<Provider store={store}>
			<PaperProvider theme={theme}>
				<StackNavigator />
			</PaperProvider>
		</Provider>
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
