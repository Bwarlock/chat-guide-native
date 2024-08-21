import { useEffect, useState } from "react";
import { AuthAxiosInstance } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthCheckRoute } from "../util/routes";
import { useAuthHook } from "../api/hooks";

const AxiosInterceptor = ({ children }) => {
	const [isSet, setIsSet] = useState(false);
	const navigation = useNavigation();
	const { logoutUser } = useAuthHook();
	useEffect(() => {
		const resInterceptor = (response) => {
			return response;
		};

		const errInterceptor = async (error) => {
			// Incase 401 Unauthorized , move the user to login , clear Storage
			if (error?.response && error.response.status === 401) {
				logoutUser();
			}
			return Promise.reject(error);
		};

		const interceptor = AuthAxiosInstance.interceptors.response.use(
			resInterceptor,
			errInterceptor
		);
		console.log("Axios Interceptor set");
		setIsSet(true);
		return () => AuthAxiosInstance.interceptors.response.eject(interceptor);
	}, []);
	return isSet && children;
};

export default AxiosInterceptor;
