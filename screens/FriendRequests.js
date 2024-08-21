import {
	RefreshControl,
	ScrollView,
	StyleSheet,
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
	MD3Colors,
	Icon,
	Text,
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

export default function FriendRequests() {
	const [menuVisible, setMenuVisible] = useState(false);

	const { currentUser, friends, users, friendRequests, requestLoading } =
		useSelector((state) => state.global);

	const navigation = useNavigation();
	const route = useRoute();
	const { logoutUser } = useAuthHook();
	const {
		getUsers,
		getFriendRequests,
		acceptFriendRequest,
		cancelFriendRequest,
	} = useUserHook();
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
		getFriendRequests();
		console.log(" Friend requests Screen");
	}, []);

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				paddingVertical: 8,
			}}
			refreshControl={
				<RefreshControl
					refreshing={requestLoading}
					onRefresh={() => {
						getFriendRequests();
					}}
				/>
			}>
			{/* <Text>hi</Text> */}

			<List.Section title="Friend Request Received">
				{friendRequests?.received?.map((user, index) => {
					return (
						<List.Item
							key={index}
							style={{
								paddingHorizontal: 8,
								borderRadius: 16,
							}}
							title={user?.name}
							description="@ USERNAME"
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
											acceptFriendRequest({ id: user._id });
										}}
										mode="contained">
										Accept
									</Button>
								</View>
							)}
						/>
					);
				})}
			</List.Section>

			<List.Section title="Friend Request Sent">
				{friendRequests?.sent?.map((user, index) => {
					return (
						<List.Item
							key={index}
							style={{
								paddingHorizontal: 8,
								borderRadius: 16,
							}}
							title={user?.name}
							description="@ USERNAME"
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
											cancelFriendRequest({ id: user._id });
										}}
										mode="contained">
										Cancel
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
