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
import { useAuthHook } from "../api/hooks";
import { useNavigation } from "@react-navigation/native";
import {
	Ionicons,
	MaterialIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UserList from "../components/UserList";

// const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const navigation = useNavigation();
	const { logoutUser } = useAuthHook();

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					{/* <Appbar.BackAction onPress={() => navigation.goBack() } /> */}
					<Appbar.Content title="Chat-Guide" />

					<Appbar.Action
						icon={() => (
							<Ionicons name="notifications-outline" size={24} color="black" />
						)}
						// icon="account-alert-outline"
						onPress={() => navigation.navigate("FriendsRequest")}
					/>
					<Menu
						style={{
							marginTop: 24,
						}}
						visible={menuVisible}
						onDismiss={closeMenu}
						anchorPosition="bottom"
						anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
						<Menu.Item onPress={() => {}} title="Settings" />
						<Menu.Item onPress={logoutUser} title="Logout" />
					</Menu>
				</Appbar.Header>
			),
		});
	}, [menuVisible]);

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
				<UserList
					users={[
						{
							_id: "sda",
							name: "Someone",
						},
						{
							_id: "sd",
							name: "Someone",
						},
					]}
				/>
			</ScrollView>
			<FAB
				icon={"account-plus"}
				// icon={"plus"}
				// icon={() => <Ionicons name="person-add" size={24} color="black" />}
				onPress={() => console.log("Pressed")}
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
