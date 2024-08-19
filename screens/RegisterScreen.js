import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	ImageBackground,
	ScrollView,
} from "react-native";
import React, { useState } from "react";
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
import {
	createUniqueIdentifier,
	validateEmail,
	validatePassword,
} from "../util/functions";
import { useAuthHook } from "../api/hooks";

const initialValues = { name: "", username: "", email: "", password: "" };
const initialErrors = { name: "", username: "", email: "", password: "" };
const passwordRegexString =
	"please ensures that the password is at least 8 characters long and contains at least one letter and one number";

export default function RegisterScreen() {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState(initialErrors);
	const [hidePassword, setHidePassword] = useState(true);
	const { registerUser } = useAuthHook();
	const navigation = useNavigation();

	const validate = () => {
		let valid = true;
		if (!values.name) {
			valid = false;
			setErrors((err) => {
				return { ...err, name: "name is required" };
			});
		}
		if (!values.password) {
			valid = false;
			setErrors((err) => {
				return { ...err, password: "password is required" };
			});
		} else if (!validatePassword(values.password)) {
			valid = false;
			setErrors((err) => {
				return {
					...err,
					password: passwordRegexString,
				};
			});
		}
		if (!values.email) {
			valid = false;
			setErrors((err) => {
				return { ...err, email: "email is required" };
			});
		} else if (!validateEmail(values.email)) {
			valid = false;
			setErrors((err) => {
				return { ...err, email: "invalid email" };
			});
		}

		return valid;
	};
	const handleRegister = () => {
		if (validate()) {
			const data = values;
			data.username = data.username
				? data.username
				: data.name + createUniqueIdentifier();
			console.log("Registered", data);

			registerUser(data);
		}
	};
	const handleSSOLogin = () => {};
	return (
		<ImageBackground
			source={null}
			style={{ flex: 1, resizeMode: "cover", overflow: "auto" }}>
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
						Register
					</Text>
					<Text
						// variant="titleSmall"
						style={{
							textAlign: "center",
							marginBottom: 20,
						}}>
						Register Your Account
					</Text>
					<TextInput
						label="Name*"
						mode="outlined"
						value={values.name}
						error={!!errors.name}
						onChangeText={(text) => {
							setValues((val) => {
								return {
									...val,
									name: text,
								};
							});
						}}
						onFocus={() => {
							setErrors(initialErrors);
						}}
						autoCapitalize="none"
					/>
					{!!errors.name && <HelperText type="error">{errors.name}</HelperText>}
					<TextInput
						label="Username"
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
						style={{ marginTop: 12 }}
					/>
					{!!errors.username ? (
						<HelperText type="error">{errors.username}</HelperText>
					) : (
						<HelperText>{"username should be unique"}</HelperText>
					)}
					<TextInput
						label="Email*"
						mode="outlined"
						value={values.email}
						error={!!errors.email}
						onChangeText={(text) => {
							setValues((val) => {
								return {
									...val,
									email: text,
								};
							});
						}}
						onFocus={() => {
							setErrors(initialErrors);
						}}
						autoCapitalize="none"
						// style={{ marginTop: 12 }}
					/>
					{!!errors.email && (
						<HelperText type="error">{errors.email}</HelperText>
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
						autoComplete="off"
						autoCorrect={false}
						style={{ marginTop: 12 }}
						right={
							<TextInput.Icon
								icon={hidePassword ? "eye" : "eye-off"}
								onPress={() => setHidePassword(!hidePassword)}
							/>
						}
					/>
					{!!errors.password ? (
						<HelperText type="error">{errors.password}</HelperText>
					) : (
						<HelperText type="">{passwordRegexString}</HelperText>
					)}
					<Button
						style={{
							marginTop: 16,
						}}
						icon="login-variant"
						mode="contained"
						onPress={handleRegister}>
						Register
					</Button>

					<Text style={{ textAlign: "center", marginTop: 12 }}>
						Or Sign in with
					</Text>
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
							onPress={() => navigation.goBack()}
							style={{
								marginTop: 16,
							}}>
							Already have an account? Login
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
