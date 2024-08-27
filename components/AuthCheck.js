import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppStackRoute, AuthStackRoute } from "../util/routes";
import { useDispatch } from "react-redux";
import { storeCurrentUser, storeToken } from "../store/globalSlice";
import { useUserHook } from "../api/hooks";

const AuthCheck = ({ navigation }) => {
	const dispatch = useDispatch();
	const { getSingleUser } = useUserHook();
	useEffect(() => {
		const checkToken = async () => {
			try {
				const token = await AsyncStorage.getItem("token");
				const user = await AsyncStorage.getItem("user");
				console.log(token, user);
				// if only toekn get the user first
				if (!token) {
					// no token
					navigation.replace(AuthStackRoute);
				} else if (!user) {
					// have token but no user ??
					await getSingleUser();
					navigation.replace(AppStackRoute);
				} else {
					// have both
					dispatch(storeToken(token));
					dispatch(storeCurrentUser(JSON.parse(user)));
					navigation.replace(AppStackRoute);
				}
			} catch (e) {
				console.log("hi error", e);
				Alert.alert("Error", e?.message);
			}
		};

		checkToken();
	}, []);

	return null;
};

export default AuthCheck;
