import {
	BackHandler,
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
	Searchbar,
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
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const { currentUser, friends, users, usersLoading } = useSelector(
		(state) => state.global
	);
	const handleBackActionPress = () => {
		setIsSearchVisible(false);
		setSearchQuery(""); // Optional: clear search query when closing
	};
	const handleFindUsers = () => {
		if (searchQuery) {
			findUsers({ searchQuery: searchQuery });
		}
	};
	const navigation = useNavigation();
	const route = useRoute();
	const { logoutUser } = useAuthHook();
	const { getUsers, getFriendRequests, sendFriendRequest, findUsers } =
		useUserHook();

	useEffect(() => {
		const onBackPress = () => {
			if (isSearchVisible) {
				handleBackActionPress();
				return true; // Prevent default behavior (exit the app)
			}
			return false; // Let the default back button behavior happen
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			onBackPress
		);

		return () => backHandler.remove();
	}, [isSearchVisible]);

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					{isSearchVisible ? (
						<>
							<Appbar.BackAction onPress={handleBackActionPress} />
							<Appbar.Content
								title={
									<Searchbar
										onSubmitEditing={handleFindUsers}
										autoFocus={true}
										placeholder="Search"
										onChangeText={(value) => {
											setSearchQuery(value);
										}}
										value={searchQuery}
										inputStyle={{
											padding: 0,
											margin: 0,
										}}
										right={() => {
											return (
												<>
													{searchQuery && (
														<IconButton
															onPress={() => {
																setSearchQuery("");
															}}
															style={{ margin: 0 }}
															icon="close"
														/>
													)}
													<IconButton
														onPress={handleFindUsers}
														icon="account-search"
													/>
												</>
											);
										}}
									/>
								}
							/>
						</>
					) : (
						<>
							<Appbar.BackAction onPress={() => navigation.goBack()} />
							<Appbar.Content title={route.name} />
							<Appbar.Action
								icon="magnify"
								onPress={() => {
									setIsSearchVisible(true);
								}}
							/>
						</>
					)}
				</Appbar.Header>
			),
		});
	}, [isSearchVisible, searchQuery]);

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
			}}
			refreshControl={
				<RefreshControl
					refreshing={usersLoading}
					onRefresh={() => {
						getUsers();
					}}
				/>
			}>
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
							description={"@" + user?.username}
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
										minWidth: 60,
										flex: 1,
										justifyContent: "center",
									}}>
									<Button
										compact={true}
										onPress={() => {
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
