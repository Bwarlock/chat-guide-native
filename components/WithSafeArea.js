import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WithSafeArea = (Component) => (props) =>
	(
		<SafeAreaView style={styles.safeArea}>
			<Component {...props} />
		</SafeAreaView>
	);

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
});

export default WithSafeArea;
