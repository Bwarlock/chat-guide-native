import {
	Text,
	StyleSheet,
	View,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Button, HelperText, TextInput } from "react-native-paper";
export default function LoginScreen() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleLogin = () => {
		if (username && password) {
			console.log("loggged");
			return;
		}

		if (!username) {
			setUsernameError("username is required");
		}
		if (!password) {
			setPasswordError("password is required");
		}
	};
	const handleSSOLogin = () => {};
	const handleRegister = () => {};
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<KeyboardAvoidingView style={styles.container}>
				<Text style={styles.title}>Login</Text>
				<TextInput
					mode="outlined"
					label="Username*"
					// error={"yo"}
					value={username}
					error={!!usernameError}
					onChangeText={setUsername}
					onFocus={() => {
						setUsernameError("");
					}}
					autoCapitalize="none"
					style={styles.input}
				/>
				{
					!!usernameError && (
						<HelperText type="error">{usernameError}</HelperText>
					)
					// : (
					// 	<HelperText type="">{"*Required"}</HelperText>
					// )
				}

				<TextInput
					mode="outlined"
					label="Password*"
					// placeholder="enter your password"
					value={password}
					error={!!passwordError}
					onFocus={() => {
						setPasswordError("");
					}}
					onChangeText={setPassword}
					secureTextEntry
					autoCapitalize="none"
					style={{ ...styles.input, marginTop: 12 }}
				/>
				{
					!!passwordError && (
						<HelperText type="error">{passwordError}</HelperText>
					)
					// : (
					// 	<HelperText type="">{"*Required"}</HelperText>
					// )
				}
				<Button
					style={styles.button}
					icon="login-variant"
					mode="contained"
					onPress={handleLogin}>
					Login
				</Button>
				<Button mode="outlined" onPress={handleRegister} style={styles.button}>
					Register
				</Button>
				<Text style={styles.ssoText}>Or sign in with</Text>
				<View style={styles.ssoContainer}>
					<Button
						icon="google"
						mode="outlined"
						onPress={() => handleSSOLogin("Google")}
						style={styles.ssoButton}>
						Google
					</Button>
					<Button
						icon="facebook"
						mode="outlined"
						onPress={() => handleSSOLogin("Facebook")}
						style={styles.ssoButton}>
						Facebook
					</Button>
					<Button
						icon="apple"
						mode="outlined"
						onPress={() => handleSSOLogin("Apple")}
						style={styles.ssoButton}>
						Apple
					</Button>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		// marginBottom: 16,
	},
	button: {
		marginTop: 16,
	},
	ssoText: {
		marginTop: 20,
		textAlign: "center",
		fontSize: 16,
		color: "#888",
	},
	ssoContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 10,
	},
	ssoButton: {
		flex: 1,
		marginHorizontal: 5,
	},
});
