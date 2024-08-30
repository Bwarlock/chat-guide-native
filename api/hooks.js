// import { Alert } from "react-native";
import { Alert } from "react-native";
import {
	AcceptFriendRequest,
	CancelFriendRequest,
	CreateMessage,
	FetchMissedMessages,
	FindUsers,
	GetFriendRequests,
	GetFriends,
	GetImage,
	GetSingleUser,
	GetUsers,
	Login,
	PrivateUser,
	ReceivedMessages,
	Register,
	RestoreMessages,
	SendFriendRequest,
	SOCKET_URL,
} from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthCheckRoute } from "../util/routes";
import { useDispatch, useSelector } from "react-redux";
import {
	clearGlobal,
	globalLoading,
	setFriendsLoading,
	setRequestLoading,
	setUsersLoading,
	storeCurrentUser,
	storeFriendRequests,
	storeFriends,
	storePrivate,
	storeToken,
	storeUsers,
} from "../store/globalSlice";
import {
	clearMessages,
	clearSpecificMessages,
	createTempMessage,
	deleteTempMessage,
	imageExist,
	storeFetchingCheck,
	storeLatestMessage,
	storeMessages,
} from "../store/messageSlice";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { createUniqueIdentifier } from "../util/functions";
import * as FileSystem from "expo-file-system";

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
			dispatch(storeToken(response?.data?.token));

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
		try {
			const response = await Login(data);
			console.log("login", response?.data);
			await AsyncStorage.setItem("token", response?.data?.token);
			await AsyncStorage.setItem("user", JSON.stringify(response?.data?.user));
			dispatch(storeCurrentUser(response?.data?.user));
			dispatch(storeToken(response?.data?.token));

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

export function useSocket() {
	const [socket, setSocket] = useState(null);
	const messageBuffer = useRef([]);
	const { token } = useSelector((state) => state.global);
	const { isFetchingMissedMessages } = useSelector((state) => state.message);
	const dispatch = useDispatch();
	const { storeMessageFunction } = useMessageHook();
	useEffect(() => {
		console.log("hi socket", token, isFetchingMissedMessages);
		if (token) {
			console.log("hi inside socket");
			const sock = io(SOCKET_URL, {
				auth: { token: token },
				transports: ["websocket"],
				upgrade: false,
			});

			sock.on("connect", () => {
				console.log("Connected to socket.io server");
			});

			sock.on("receiveMessage", async (message) => {
				console.log("message recieved", message, isFetchingMissedMessages);
				// if (isFetchingMissedMessages) {
				// 	messageBuffer.current.push(message);
				// } else {
				await storeMessageFunction([message]);
				// dispatch(storeMessages({ id: message?.senderId, messages: [message] }));
				// dispatch(
				// 	storeLatestMessage({ id: message?.senderId, message: message })
				// );
				// }
				sock?.emit("messageReceived", message._id);
			});

			sock.on("disconnect", () => {
				console.log("Disconnected from socket.io server");
			});
			sock.on("connect_failed", () => {
				console.log("Error from socket.io server");
			});

			setSocket(sock);

			return () => {
				console.log("destorying   ............");
				sock.disconnect();
			};
		}
	}, []);

	useEffect(() => {
		console.log("fetch changed", isFetchingMissedMessages);

		if (!isFetchingMissedMessages && messageBuffer.current.length > 0) {
			const messages = {};
			messageBuffer.current.forEach((msg) => {
				if (!messages[msg.senderId]) {
					messages[msg.senderId] = [];
				}
				messages[msg.senderId].push(msg);
				socket.emit("messageReceived", msg._id);
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

			messageBuffer.current = [];
		}
	}, [isFetchingMissedMessages]);

	return socket;
}

export const useMessageHook = () => {
	const dispatch = useDispatch();

	const getImage = async (message) => {
		try {
			const response = await GetImage(message._id);
			const base64Image = response.data;

			const fileUri = FileSystem.documentDirectory + message.imageUrl;

			// Save the file using Expo's FileSystem
			await FileSystem.writeAsStringAsync(fileUri, base64Image, {
				encoding: FileSystem.EncodingType.Base64,
			});

			console.log("Image saved at:", fileUri);
			dispatch(imageExist({ id: message._id }));
		} catch (error) {
			console.log("image get", error);
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};

	const storeMessageFunction = async (msges, currentUserId) => {
		const messages = {};
		const messageById = {};
		const messagesIds = [];
		try {
			for (const msg of msges) {
				const id =
					msg.senderId === currentUserId ? msg.recipientId : msg.senderId;
				if (!messages[id]) {
					messages[id] = [];
				}
				if (!messageById[id]) {
					messageById[id] = {};
				}
				console.log(id);
				console.log(msg);
				let exists = false;
				if (msg.messageType == "image") {
					const fileInfo = await FileSystem.getInfoAsync(
						FileSystem.documentDirectory + msg.imageUrl
					);
					exists = fileInfo.exists;
				}
				messageById[id][msg._id] = msg;
				messageById[id][msg._id].imageExist = exists;
				messages[id].push(msg._id);
				messagesIds.push(msg._id);
			}

			console.log("sad", messageById);
			Object.keys(messages).forEach((key) => {
				dispatch(
					storeMessages({
						id: key,
						messages: messages[key],
						messageById: messageById[key],
					})
				);
				console.log(
					"latent",
					messageById[key][messages[key][messages[key].length - 1]]
				);
				dispatch(
					storeLatestMessage({
						id: key,
						message: messageById[key][messages[key][messages[key].length - 1]],
					})
				);
			});
		} catch (error) {
			console.log("stor hook");
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
		return { messages, messagesIds };
	};
	const createMessage = async (data, image) => {
		const newData = {
			...data,
			_id: createUniqueIdentifier(),
			createdAt: new Date().toString(),
		};
		try {
			const formdata = new FormData();

			if (data.messageType == "image" && image?.uri) {
				// save to file system
				// data . url  <-- image.uri
				console.log("insideeee");
				const directory = FileSystem.documentDirectory;
				const newPath = directory + image.fileName;

				// Create the directory if it doesn't exist
				// const directoryInfo = await FileSystem.getInfoAsync(directory);
				// if (!directoryInfo.exists) {
				// 	await FileSystem.makeDirectoryAsync(directory, {
				// 		intermediates: true,
				// 	});
				// }

				await FileSystem.copyAsync({
					from: image?.uri,
					to: newPath,
				});
				data.imageUrl = image.fileName;
				newData.imageUrl = image.fileName;
				newData.imageExist = true;

				formdata.append("image", {
					uri: image.uri,
					name: image.fileName,
					type: image.mimeType,
				});
			}

			Object.keys(data).forEach((key) => {
				formdata.append("" + key, "" + data[key]);
			});
			console.log(data);

			console.log("formmm", newData);
			dispatch(createTempMessage(newData));
			const response = await CreateMessage(formdata);
			dispatch(deleteTempMessage(newData));

			console.log("message created");
			if (response?.data?.chatMessage) {
				await storeMessageFunction(
					[response?.data?.chatMessage],
					response?.data?.chatMessage?.senderId
				);
			}
		} catch (error) {
			dispatch(deleteTempMessage(newData));
			console.log("create hook", error);
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};

	const fetchMissedMessages = async () => {
		try {
			dispatch(storeFetchingCheck(true));
			const response = await FetchMissedMessages();
			console.log("message getting");
			if (response?.data?.chatMessages?.length) {
				const { messages, messagesIds } = await storeMessageFunction(
					response?.data?.chatMessages
				);

				await ReceivedMessages(messagesIds);
			}

			dispatch(storeFetchingCheck(false));
		} catch (error) {
			dispatch(storeFetchingCheck(false));
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const restoreMessages = async (currentUser) => {
		try {
			const response = await RestoreMessages();
			console.log("message restoring");
			if (response?.data?.chatMessages?.length) {
				// clear previous ones (most likely case is its empty if u r pressing restore tho)
				dispatch(clearSpecificMessages());
				await storeMessageFunction(
					response?.data?.chatMessages,
					currentUser._id
				);
				Alert.alert("Success", "Restored Chat");
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	return {
		getImage,
		storeMessageFunction,
		createMessage,
		fetchMissedMessages,
		restoreMessages,
	};
};

export const useUserHook = () => {
	const dispatch = useDispatch();
	const getFriends = async () => {
		try {
			dispatch(setFriendsLoading(true));
			const response = await GetFriends();
			console.log("get firneds");
			if (response?.data?.friends) {
				dispatch(storeFriends(response?.data?.friends));
			}
			dispatch(setFriendsLoading(false));
		} catch (error) {
			dispatch(setFriendsLoading(false));
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const getSingleUser = async (id = "") => {
		try {
			const response = await GetSingleUser(id);
			console.log("get user songle", response?.data?.user);
			if (response?.data?.user) {
				await AsyncStorage.setItem(
					"user",
					JSON.stringify(response?.data?.user)
				);
				dispatch(storeCurrentUser(response?.data?.user));
			}
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const getUsers = async () => {
		try {
			dispatch(setUsersLoading(true));
			const response = await GetUsers();
			console.log("get users", response?.data?.users);
			if (response?.data?.users) {
				dispatch(storeUsers(response?.data?.users));
			}
			dispatch(setUsersLoading(false));
		} catch (error) {
			dispatch(setUsersLoading(false));
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const findUsers = async (params) => {
		try {
			dispatch(setUsersLoading(true));
			const response = await FindUsers(params);
			console.log("find user", response?.data?.users);
			if (response?.data?.users) {
				dispatch(storeUsers(response?.data?.users));
			}
			dispatch(setUsersLoading(false));
		} catch (error) {
			dispatch(setUsersLoading(false));
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	const getFriendRequests = async (data) => {
		try {
			dispatch(setRequestLoading(true));
			const response = await GetFriendRequests(data);
			console.log("Friend req");
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

	const privateUser = async (data) => {
		try {
			const response = await PrivateUser(data);
			dispatch(storePrivate(data.private));
			Alert.alert("Success", response?.data?.message);
		} catch (error) {
			Alert.alert("Error", error?.response?.data?.message ?? error?.message);
		}
	};
	return {
		getSingleUser,
		getFriends,
		getUsers,
		findUsers,
		getFriendRequests,
		sendFriendRequest,
		cancelFriendRequest,
		acceptFriendRequest,
		privateUser,
	};
};
