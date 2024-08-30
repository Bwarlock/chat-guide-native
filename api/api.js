import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

// export const SOCKET_URL =
// 	"https://chat-guide-d0dqd0ggfxawhjes.eastasia-01.azurewebsites.net";
// const BASE_URL =
// 	"https://chat-guide-d0dqd0ggfxawhjes.eastasia-01.azurewebsites.net/api";

export const SOCKET_URL = "http://192.168.1.4:8000";
const BASE_URL = "http://192.168.1.4:8000/api";

// export const SOCKET_URL = "http://192.168.7.181:8000";
// const BASE_URL = "http://192.168.7.181:8000/api";

export const BaseAxiosInstance = axios.create({
	baseURL: BASE_URL,
});

export const AuthAxiosInstance = axios.create({
	baseURL: BASE_URL,
});

AuthAxiosInstance.interceptors.request.use(
	async (config) => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		} catch (error) {
			Alert.alert("Error retrieving token", error?.message);
		}
		return config;
	},
	(error) => {
		Alert.alert("Error", error?.message);
		return Promise.reject(error);
	}
);

export function Register(data) {
	return BaseAxiosInstance({
		method: "post",
		url: "/auth/register",
		data: data,
	});
}

export function Login(data) {
	return BaseAxiosInstance({
		method: "post",
		url: "/auth/login",
		data: data,
	});
}

export function GetSingleUser(id) {
	return AuthAxiosInstance({
		method: "get",
		url: `/user/get-user`,
	});
}

export function GetUsers() {
	return AuthAxiosInstance({
		method: "get",
		url: "/user/get-users",
	});
}

export function GetFriends() {
	return AuthAxiosInstance({
		method: "get",
		url: "/user/get-friends",
	});
}

export function FindUsers(params) {
	return AuthAxiosInstance({
		method: "get",
		url: "/user/find-users",
		params: params,
	});
}

export function GetFriendRequests() {
	return AuthAxiosInstance({
		method: "get",
		url: "/user/get-friend-requests",
	});
}

export function SendFriendRequest(data) {
	return AuthAxiosInstance({
		method: "post",
		url: "/user/send-friend-request",
		data: data,
	});
}

export function CancelFriendRequest(data) {
	return AuthAxiosInstance({
		method: "post",
		url: "/user/cancel-friend-request",
		data: data,
	});
}

export function AcceptFriendRequest(data) {
	return AuthAxiosInstance({
		method: "post",
		url: "/user/accept-friend-request",
		data: data,
	});
}

export function PrivateUser(data) {
	return AuthAxiosInstance({
		method: "post",
		url: "/user/private",
		data: data,
	});
}

export function FetchMissedMessages() {
	return AuthAxiosInstance({
		method: "get",
		url: "/message/get-messages",
	});
}

export function RestoreMessages() {
	return AuthAxiosInstance({
		method: "get",
		url: "/message/restore-messages",
	});
}

export function CreateMessage(data) {
	return AuthAxiosInstance({
		method: "post",
		url: "/message/create-message",
		data: data,
		headers: { "Content-Type": "multipart/form-data" },
	});
}

export function ReceivedMessages(data) {
	return AuthAxiosInstance({
		method: "post",
		url: "/message/received-messages",
		data: data,
	});
}

export function GetImage(id) {
	return AuthAxiosInstance({
		method: "get",
		url: `/message/get-image/${id}`,
	});
}
