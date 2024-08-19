import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	Button,
	Title,
	Paragraph,
	IconButton,
	Menu,
	PaperProvider,
	Appbar,
	FAB,
	List,
	Avatar,
} from "react-native-paper";
import { useAuthHook, useUserHook } from "../api/hooks";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	Ionicons,
	MaterialIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UserList from "../components/UserList";
import {
	AddFriendRoute,
	FriendRequestsRoute,
	SettingsRoute,
} from "../util/routes";
import { useSelector } from "react-redux";

// const Tab = createMaterialTopTabNavigator();

export default function AddFriend() {
	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);
	const { currentUser, friends, users } = useSelector((state) => state.global);

	const navigation = useNavigation();
	const route = useRoute();
	const { logoutUser } = useAuthHook();
	const { getUsers, getFriendRequests, sendFriendRequest } = useUserHook();
	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					<Appbar.BackAction onPress={() => navigation.goBack()} />
					<Appbar.Content title={route.name} />
				</Appbar.Header>
			),
		});
	}, [menuVisible]);

	useEffect(() => {
		// Starting Singular Requests
		// need redux finally
		getUsers();
		console.log("Add Friend");
	}, []);

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				paddingVertical: 8,
			}}>
			{/* <Text>hi</Text> */}
			<UserList
				users={users}
				extra={true}
				extraText={"Add Friend"}
				extraFunction={sendFriendRequest}
			/>
		</ScrollView>
	);
}
