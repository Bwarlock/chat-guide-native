import {
	RefreshControl,
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
	Icon,
	MD3Colors,
	Divider,
} from "react-native-paper";
import { useAuthHook, useUserHook } from "../api/hooks";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	Ionicons,
	MaterialIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
	AddFriendRoute,
	ChatMessageRoute,
	FriendRequestsRoute,
	SettingsRoute,
} from "../util/routes";
import { useSelector } from "react-redux";

// const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);
	const { currentUser, friends, users, friendsLoading, requestLoading } =
		useSelector((state) => state.global);

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
		// getUsers();
		// Need to Get Message Queue
		getFriends();
		getFriendRequests();
		console.log("home Screen");
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
				}}
				refreshControl={
					<RefreshControl
						refreshing={friendsLoading || requestLoading}
						onRefresh={() => {
							// get message queue too
							getFriends();
							getFriendRequests();
						}}
					/>
				}>
				<List.Section>
					{friends?.map((user, index) => {
						return (
							<List.Item
								key={index}
								style={{
									paddingHorizontal: 8,
									borderRadius: 16,
								}}
								onPress={() => {
									navigation.navigate({
										name: ChatMessageRoute,
										params: { id: user._id },
									});
									console.log(user._id);
								}}
								title={user?.name}
								description="latest message"
								left={() => (
									<Avatar.Image
										style={{
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: MD3Colors.secondary90,
										}}
										size={48}
										source={
											user?.image
												? user?.image
												: ({ size }) => {
														return <Icon source="account" size={32} />;
												  }
										}
									/>
								)}
							/>
						);
					})}
				</List.Section>
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
