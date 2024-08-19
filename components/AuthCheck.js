import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppStackRoute, AuthStackRoute } from "../util/routes";
import { useDispatch } from "react-redux";
import { storeCurrentUser } from "../store/globalSlice";

const AuthCheck = ({ navigation }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		const checkToken = async () => {
			try {
				const token = await AsyncStorage.getItem("token");

				if (token) {
					const user = await AsyncStorage.getItem("user");
					dispatch(storeCurrentUser(JSON.parse(user)));
					navigation.replace(AppStackRoute);
				} else {
					navigation.replace(AuthStackRoute);
				}
			} catch (e) {
				Alert.alert("Error", e?.message);
			}
		};

		checkToken();
	}, []);

	return null;
};

export default AuthCheck;
