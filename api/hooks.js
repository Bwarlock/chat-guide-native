// import { Alert } from "react-native";
import { Alert } from "react-native";
import {
	AcceptFriendRequest,
	CancelFriendRequest,
	CreateMessage,
	DeleteMessageQueue,
	FindUsers,
	GetFriendRequests,
	GetFriends,
	GetMessages,
	GetUsers,
	Login,
	Register,
	RestoreMessages,
	SendFriendRequest,
} from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthCheckRoute } from "../util/routes";
import { useDispatch } from "react-redux";
import {
	clearGlobal,
	globalLoading,
	setFriendsLoading,
	setRequestLoading,
	storeCurrentUser,
	storeFriendRequests,
	storeFriends,
	storeUsers,
} from "../store/globalSlice";
import {
	clearMessages,
	storeLatestMessage,
	storeMessages,
} from "../store/messageSlice";

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
			await AsyncStorage.clear();
			dispatch(clearGlobal());
			dispatch(clearMessages());

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

export const useMessageHook = () => {
	const dispatch = useDispatch();
	const createMessage = async (data) => {
		try {
			const response = await CreateMessage(data);
			console.log("message created", response?.data?.chatMessage);
			if (response?.data?.chatMessage) {
				dispatch(
					storeMessages({
						id: response?.data?.chatMessage?.recipientId,
						messages: [response?.data?.chatMessage],
					})
				);
				dispatch(
					storeLatestMessage({
						id: response?.data?.chatMessage?.recipientId,
						message: response?.data?.chatMessage,
					})
				);
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};

	const getMessages = async () => {
		try {
			const response = await GetMessages();
			console.log("message getting", response?.data?.chatMessages);
			if (response?.data?.chatMessages?.length) {
				const messages = {};
				response?.data?.chatMessages?.forEach((msg) => {
					if (!messages[msg.senderId]) {
						messages[msg.senderId] = [];
					}
					messages[msg.senderId].push(msg);
				});
				// Make the server Delete the queue
				await DeleteMessageQueue();
				Object.keys(messages).forEach((key) => {
					dispatch(
						storeMessages({
							id: key,
							messages: messages[key],
						})
					);
					dispatch(
						storeLatestMessage({
							id: key,
							message: messages[messages[key].length - 1],
						})
					);
				});
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const restoreMessages = async (currentUser) => {
		try {
			const response = await RestoreMessages();
			console.log("message restoring", response?.data?.chatMessages);
			if (response?.data?.chatMessages?.length) {
				// clear previous ones (most likely case is its empty if u r pressing restore tho)
				dispatch(clearMessages());
				const messages = {};
				response?.data?.chatMessages?.forEach((msg) => {
					const id =
						msg.senderId === currentUser._id ? msg.recipientId : msg.senderId;
					if (!messages[id]) {
						messages[id] = [];
					}
					messages[id].push(msg);
				});
				Object.keys(messages).forEach((key) => {
					dispatch(
						storeMessages({
							id: key,
							messages: messages[key],
						})
					);
					dispatch(
						storeLatestMessage({
							id: key,
							message: messages[messages[key].length - 1],
						})
					);
				});
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	return { createMessage, getMessages, restoreMessages };
};

export const useUserHook = () => {
	const dispatch = useDispatch();
	const getFriends = async () => {
		try {
			dispatch(setFriendsLoading(true));
			const response = await GetFriends();
			console.log("get firneds", response?.data?.friends);
			if (response?.data?.friends) {
				dispatch(storeFriends(response?.data?.friends));
			}
			dispatch(setFriendsLoading(false));
		} catch (error) {
			dispatch(setFriendsLoading(false));
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
			dispatch(setRequestLoading(true));
			const response = await GetFriendRequests(data);
			console.log("Friend req", response?.data?.friendRequests);
			if (
				response?.data?.friendRequests &&
				response?.data?.sentFriendRequests
			) {
				dispatch(
					storeFriendRequests({
						received: response?.data?.friendRequests,
						sent: response?.data?.sentFriendRequests,
					})
				);
			}
			dispatch(setRequestLoading(false));
		} catch (error) {
			dispatch(setRequestLoading(false));
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
	const cancelFriendRequest = async (data) => {
		try {
			const response = await CancelFriendRequest(data);
			Alert.alert("Success", response?.data?.message);
			getFriendRequests();
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
		cancelFriendRequest,
		acceptFriendRequest,
	};
};
