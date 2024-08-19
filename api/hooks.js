// import { Alert } from "react-native";
import { Alert } from "react-native";
import { Login, Register } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthCheckRoute } from "../util/routes";

export const useAuthHook = () => {
	const navigation = useNavigation();

	const registerUser = async (data) => {
		try {
			const response = await Register(data);
			console.log("register", response?.data);
			await AsyncStorage.setItem("token", response?.data?.token);
			Alert.alert("Registered", response?.data?.message);
			navigation.reset({
				index: 0,
				routes: [{ name: AuthCheckRoute }],
			});
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const loginUser = async (data) => {
		console.log("hii");
		try {
			const response = await Login(data);
			console.log("login", response?.data);
			await AsyncStorage.setItem("token", response?.data?.token);
			Alert.alert("Login Successful", response?.data?.message);
			navigation.reset({
				index: 0,
				routes: [{ name: AuthCheckRoute }],
			});
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const logoutUser = async () => {
		try {
			await AsyncStorage.removeItem("token");
			navigation.reset({
				index: 0,
				routes: [{ name: AuthCheckRoute }],
			});
		} catch (error) {
			Alert.alert("Error", error?.message);
		}
	};
	return { registerUser, loginUser, logoutUser };
};
