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

export default function HomeScreen() {
	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);
	const { currentUser, friends, users } = useSelector((state) => state.global);

	const navigation = useNavigation();
	const route = useRoute();

	const { logoutUser } = useAuthHook();
	const { getUsers, getFriendRequests, getFriends } = useUserHook();
	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					{/* <Appbar.BackAction onPress={() => navigation.goBack() } /> */}
					<Appbar.Content title={route.name} />

					<Appbar.Action
						icon={() => (
							<Ionicons name="notifications-outline" size={24} color="black" />
						)}
						// icon="account-alert-outline"
						onPress={() => navigation.navigate(FriendRequestsRoute)}
					/>
					<Menu
						style={{
							marginTop: 24,
						}}
						visible={menuVisible}
						onDismiss={closeMenu}
						anchorPosition="bottom"
						anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
						<Menu.Item
							onPress={() => {
								closeMenu();
								navigation.navigate(SettingsRoute);
							}}
							title="Settings"
						/>
						<Menu.Item
							onPress={() => {
								closeMenu();
								logoutUser();
							}}
							title="Logout"
						/>
					</Menu>
				</Appbar.Header>
			),
		});
	}, [menuVisible]);

	useEffect(() => {
		// Starting Singular Requests
		// need redux finally
		getUsers();
		getFriends();
		getFriendRequests();
		console.log("audoaoosdai");
	}, []);

	return (
		// <Tab.Navigator
		// 	screenOptions={{
		// 		tabBarStyle: { display: "none" },
		// 		// tabBarScrollEnabled: true,
		// 	}}>
		// 	Will Later Implement it
		// 	<Tab.Screen name="H" component={Hiya} />
		// </Tab.Navigator>
		<>
			<ScrollView
				contentContainerStyle={{
					flex: 1,
					paddingVertical: 8,
				}}>
				{/* <Text>hi</Text> */}
				<UserList users={friends} extra={false} />
			</ScrollView>
			<FAB
				icon={"account-plus"}
				// icon={"plus"}
				// icon={() => <Ionicons name="person-add" size={24} color="black" />}
				onPress={() => {
					navigation.navigate(AddFriendRoute);
				}}
				visible={true}
				iconMode={"static"}
				style={{
					bottom: 16,
					right: 16,
					position: "absolute",
				}}
			/>
		</>
	);
}

const styles = StyleSheet.create({});
