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
	Badge,
} from "react-native-paper";
import {
	useAuthHook,
	useMessageHook,
	useSocket,
	useUserHook,
} from "../api/hooks";
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
import { useDispatch, useSelector } from "react-redux";
// import { createTable } from "../store/db";
// import useTransactionFunctions from "../store/transactions";

// const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
	const socket = useSocket();

	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);
	const {
		currentUser,
		friends,
		users,
		friendsLoading,
		token,
		requestLoading,
		friendRequests,
	} = useSelector((state) => state.global);
	const { latest, messages, messageById } = useSelector(
		(state) => state.message
	);
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const route = useRoute();

	const { logoutUser } = useAuthHook();
	const { getFriendRequests, getFriends } = useUserHook();
	const { restoreMessages, fetchMissedMessages } = useMessageHook();
	// const { createTable, insertMessage, getMessages } = useTransactionFunctions();

	useEffect(() => {
		// setTimeout(() => {
		// 	createTable();
		// }, 5000);
		fetchMissedMessages();
		getFriends();
		getFriendRequests();
		console.log("home Screen");
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					{/* <Appbar.BackAction onPress={() => navigation.goBack() } /> */}
					<Appbar.Content title={route.name} />

					<Appbar.Action
						icon={() => (
							<View
								style={{
									position: "relative",
								}}>
								<Ionicons
									name="notifications-outline"
									size={24}
									color="black"
								/>
								<Badge
									style={{
										position: "absolute",
										top: -4,
										right: -4,
									}}
									size={14}>
									{friendRequests?.received?.length}
								</Badge>
							</View>
						)}
						// icon="account-alert-outline"
						onPress={() => navigation.navigate(FriendRequestsRoute)}
					/>
					<Menu
						style={
							{
								// marginTop: 24,
							}
						}
						visible={menuVisible}
						onDismiss={closeMenu}
						anchorPosition="bottom"
						anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
						<Menu.Item
							onPress={() => {
								closeMenu();
								restoreMessages(currentUser);
							}}
							title="Restore Chat"
						/>
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
	}, [menuVisible, friendRequests.received]);

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
							fetchMissedMessages();
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
										params: { user: user },
									});
								}}
								title={user?.name}
								description={
									latest[user?._id]?.messageType == "text"
										? latest[user?._id].message
										: "Image"
								}
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
