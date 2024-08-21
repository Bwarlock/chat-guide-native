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
	Icon,
	MD3Colors,
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
		console.log("Add Friend Screen");
	}, []);

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				paddingVertical: 8,
			}}>
			{/* <Text>hi</Text> */}

			<List.Section>
				{users?.map((user, index) => {
					return (
						<List.Item
							key={index}
							style={{
								paddingHorizontal: 8,
								borderRadius: 16,
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
							right={() => (
								<View
									style={{
										flex: 1,
										justifyContent: "center",
									}}>
									<Button
										compact={true}
										onPress={() => {
											console.log(user._id);
											sendFriendRequest({ id: user._id });
										}}
										mode="contained">
										Add Friend
									</Button>
								</View>
							)}
						/>
					);
				})}
			</List.Section>
		</ScrollView>
	);
}
