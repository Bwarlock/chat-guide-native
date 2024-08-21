import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	ImageBackground,
	ScrollView,
	Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
	Text,
	Button,
	HelperText,
	IconButton,
	TextInput,
	MD3Colors,
} from "react-native-paper";
import background_1 from "../assets/background_1.jpg";
import { useNavigation } from "@react-navigation/native";
import { AppStackRoute, AuthStackRoute, RegisterRoute } from "../util/routes";
import { validateEmail } from "../util/functions";
import { useAuthHook } from "../api/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeCurrentUser } from "../store/globalSlice";

const initialValues = { username: "", password: "" };
const initialErrors = { username: "", password: "" };

export default function LoginScreen() {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState(initialErrors);
	const [hidePassword, setHidePassword] = useState(true);
	const { loginUser } = useAuthHook();

	const navigation = useNavigation();

	const validate = () => {
		let valid = true;
		if (!values.username) {
			valid = false;
			setErrors((err) => {
				return { ...err, username: "username or email is required" };
			});
		}
		if (!values.password) {
			valid = false;
			setErrors((err) => {
				return { ...err, password: "password is required" };
			});
		}
		return valid;
	};
	const handleLogin = () => {
		if (validate()) {
			if (validateEmail(values.username)) {
				const { username, ...rest } = values;
				rest.email = username;
				loginUser(rest);
			} else {
				loginUser(values);
			}
		}
	};
	const handleSSOLogin = () => {};
	return (
		<ImageBackground
			source={null}
			style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}>
			<KeyboardAvoidingView
				style={{
					flex: 1,
				}}
				behavior="padding">
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
						padding: 24,
					}}
					keyboardShouldPersistTaps="handled">
					<Text
						variant="headlineLarge"
						style={{
							textAlign: "center",
							marginTop: 24,
						}}>
						Login
					</Text>
					<Text
						// variant="titleSmall"
						style={{
							textAlign: "center",
							marginBottom: 20,
						}}>
						Login To Chat-Guide
					</Text>
					<TextInput
						label="Username or Email*"
						mode="outlined"
						value={values.username}
						error={!!errors.username}
						onChangeText={(text) => {
							setValues((val) => {
								return {
									...val,
									username: text,
								};
							});
						}}
						onFocus={() => {
							setErrors(initialErrors);
						}}
						autoCapitalize="none"
					/>
					{!!errors.username && (
						<HelperText type="error">{errors.username}</HelperText>
					)}

					<TextInput
						label="Password*"
						mode="outlined"
						// placeholder="enter your password"
						value={values.password}
						error={!!errors.password}
						onFocus={() => {
							setErrors(initialErrors);
						}}
						onChangeText={(text) => {
							setValues((val) => {
								return {
									...val,
									password: text,
								};
							});
						}}
						secureTextEntry={hidePassword}
						autoCapitalize="none"
						style={{ marginTop: 12 }}
						right={
							<TextInput.Icon
								icon={hidePassword ? "eye" : "eye-off"}
								onPress={() => setHidePassword(!hidePassword)}
							/>
						}
					/>
					{!!errors.password && (
						<HelperText type="error">{errors.password}</HelperText>
					)}
					<Button
						style={{
							marginTop: 16,
						}}
						icon="login-variant"
						mode="contained"
						onPress={handleLogin}>
						Login
					</Button>
					<View style={styles.flexContainer}>
						<Button style={{ marginTop: 12 }} mode="text" onPress={() => {}}>
							Forgot Password ?
						</Button>
					</View>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
							marginTop: 12,
						}}>
						<IconButton
							icon="google"
							mode="outlined"
							style={{ marginHorizontal: 8 }}
							// iconColor={MD3Colors.error50}
							size={32}
							onPress={() => handleSSOLogin("Google")}
						/>
						<IconButton
							icon="facebook"
							mode="outlined"
							style={{ marginHorizontal: 8 }}
							// iconColor={MD3Colors.error50}
							size={32}
							onPress={() => handleSSOLogin("Facebook")}
						/>
						<IconButton
							icon="apple"
							mode="outlined"
							style={{ marginHorizontal: 8 }}
							// iconColor={MD3Colors.error50}
							size={32}
							onPress={() => handleSSOLogin("Apple")}
						/>
					</View>
					<View style={styles.flexContainer}>
						<Button
							mode="text"
							onPress={() => navigation.navigate(RegisterRoute)}
							style={{
								marginTop: 16,
							}}>
							New User? Register Now
						</Button>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	flexContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	flexItems: {
		flexGrow: 1,
	},
	ssoButton: {
		// flex: 1,
		marginHorizontal: 8,
	},
});
