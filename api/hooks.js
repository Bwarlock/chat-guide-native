// import { Alert } from "react-native";
import { Alert } from "react-native";
import {
	AcceptFriendRequest,
	FindUsers,
	GetFriendRequests,
	GetFriends,
	GetUsers,
	Login,
	Register,
	SendFriendRequest,
} from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthCheckRoute } from "../util/routes";
import { useDispatch } from "react-redux";
import {
	storeCurrentUser,
	storeFriendRequests,
	storeFriends,
	storeUsers,
} from "../store/globalSlice";

export const useAuthHook = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();

	const registerUser = async (data) => {
		try {
			const response = await Register(data);
			console.log("register", response?.data);
			await AsyncStorage.setItem("token", response?.data?.token);
			await AsyncStorage.setItem("user", JSON.stringify(response?.data?.user));
			dispatch(storeCurrentUser(response?.data?.user));

			Alert.alert("Success", response?.data?.message);
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
			await AsyncStorage.setItem("user", JSON.stringify(response?.data?.user));
			dispatch(storeCurrentUser(response?.data?.user));

			Alert.alert("Success", response?.data?.message);
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

export const useUserHook = () => {
	const dispatch = useDispatch();
	const getFriends = async () => {
		try {
			const response = await GetFriends();
			console.log("get firneds", response?.data?.friends);
			if (response?.data?.friends) {
				dispatch(storeFriends(response?.data?.friends));
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const getUsers = async () => {
		try {
			const response = await GetUsers();
			console.log("get user", response?.data?.users);
			if (response?.data?.users) {
				dispatch(storeUsers(response?.data?.users));
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const findUsers = async (params) => {
		try {
			const response = await FindUsers(params);
			console.log("find user", response?.data?.users);
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const getFriendRequests = async (data) => {
		try {
			const response = await GetFriendRequests(data);
			console.log("Friend req", response?.data?.friendRequests);
			if (response?.data?.friendRequests) {
				dispatch(storeFriendRequests(response?.data?.friendRequests));
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const sendFriendRequest = async (data) => {
		try {
			const response = await SendFriendRequest(data);
			Alert.alert("Success", response?.data?.message);
			getUsers();
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const acceptFriendRequest = async (data) => {
		try {
			const response = await AcceptFriendRequest(data);
			Alert.alert("Success", response?.data?.message);
			getFriendRequests();
			getFriends();
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	return {
		getFriends,
		getUsers,
		findUsers,
		getFriendRequests,
		sendFriendRequest,
		acceptFriendRequest,
	};
};
