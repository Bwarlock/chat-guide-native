import React, { useLayoutEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
	Avatar,
	Title,
	Caption,
	Paragraph,
	Drawer,
	Text,
	TouchableRipple,
	Switch,
	IconButton,
	List,
	Portal,
	Modal,
	RadioButton,
	Appbar,
	Dialog,
	Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthHook, useMessageHook, useUserHook } from "../api/hooks";
import { useDispatch, useSelector } from "react-redux";
import { storeTheme } from "../store/globalSlice";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function Settings() {
	const navigation = useNavigation();
	const route = useRoute();

	const { logoutUser } = useAuthHook();
	const { privateUser, getSingleUser } = useUserHook();
	const { restoreMessages } = useMessageHook();
	const { theme, currentUser } = useSelector((state) => state.global);
	const dispatch = useDispatch();

	const onPrivateToggle = (value) => {
		privateUser({ private: value });
	};
	const [themeModalvisible, setThemeModalvisible] = useState(false);

	const showthemeModal = () => setThemeModalvisible(true);
	const hidethemeModal = () => setThemeModalvisible(false);
	const setTheme = (value) => {
		dispatch(storeTheme(value));
	};

	const [logoutVisible, setLogoutVisible] = useState(false);
	const [restoreVisible, setRestoreVisible] = useState(false);

	const showLogoutModal = () => setLogoutVisible(true);
	const hideLogoutModal = () => setLogoutVisible(false);

	const showRestoreModal = () => setRestoreVisible(true);
	const hideRestoreModal = () => setRestoreVisible(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					<Appbar.BackAction onPress={() => navigation.goBack()} />
					<Appbar.Content title={route.name} />
					<Appbar.Action icon="refresh" onPress={getSingleUser} />
				</Appbar.Header>
			),
		});
	}, []);
	return (
		<ScrollView contentContainerStyle={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<View style={{ paddingHorizontal: 30, marginBottom: 25 }}>
					<View style={{ flexDirection: "row", marginTop: 15 }}>
						<Avatar.Image
							source={{
								uri: "https://www.example.com/avatar.png", // Replace with user's avatar URL
							}}
							size={80}
						/>
						<View
							style={{
								marginLeft: 20,
								flexShrink: 1,
							}}>
							<Title
								style={{
									fontSize: 24,
									fontWeight: "bold",
								}}>
								{currentUser?.name}
							</Title>
							<Caption
								style={{
									fontSize: 14,
									lineHeight: 14,
									fontWeight: "500",
								}}>
								@{currentUser?.username}
							</Caption>
						</View>
						<View
							style={{
								flexGrow: 1,
								flexDirection: "row",
								justifyContent: "flex-end",
							}}>
							<IconButton
								icon={({ color, size }) => (
									<Icon name="account-edit" color={color} size={size} />
								)}
								onPress={() => {
									Alert.alert("Error", "Not Implemented");
								}}
							/>
						</View>
					</View>
				</View>

				<View style={{ paddingHorizontal: 30, marginBottom: 25 }}>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<Icon name="email" color="#777777" size={20} />
						<Text style={{ color: "#777777", marginLeft: 20 }}>
							{currentUser?.email}
						</Text>
					</View>
				</View>

				<Drawer.Section showDivider={false} title="Preferences">
					<Drawer.Item
						icon={({ color, size }) => (
							<Icon name="theme-light-dark" color={color} size={size} />
						)}
						label="Change Theme"
						onPress={showthemeModal}
					/>

					<Drawer.Item
						label="Private"
						icon="account-lock"
						onPress={onPrivateToggle}
						right={() => (
							<Switch
								value={currentUser.private}
								onValueChange={onPrivateToggle}
							/>
						)}
					/>
				</Drawer.Section>
				<Drawer.Section showDivider={false} title="Backup and Restore">
					<Drawer.Item
						icon="cloud-upload"
						label="Create Backup"
						onPress={() => {
							Alert.alert("Error", "Not Implemented");
						}}
					/>

					<Drawer.Item
						label="Restore Backup"
						icon="cloud-download"
						onPress={() => {
							Alert.alert("Error", "Not Implemented");
						}}
					/>
					<Drawer.Item
						label="Restore Chat From DB"
						icon="cloud-download"
						onPress={showRestoreModal}
					/>
				</Drawer.Section>
			</View>

			<Drawer.Section
				showDivider={false}
				style={{
					marginBottom: 15,
					borderTopColor: "#f4f4f4",
					borderTopWidth: 1,
				}}>
				<Drawer.Item
					icon={({ color, size }) => (
						<Icon name="exit-to-app" color={color} size={size} />
					)}
					label="Sign Out"
					onPress={showLogoutModal}
				/>
			</Drawer.Section>
			<Portal>
				<Dialog visible={logoutVisible} onDismiss={hideLogoutModal}>
					<Dialog.Title>Confirm Logout</Dialog.Title>
					<Dialog.Content>
						<Paragraph>
							Are you sure you want to logout? All the local chat will be lost
						</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideLogoutModal}>No</Button>
						<Button
							onPress={() => {
								hideLogoutModal();
								logoutUser();
							}}>
							Yes
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Portal>
				<Dialog visible={restoreVisible} onDismiss={hideRestoreModal}>
					<Dialog.Title>Confirm Restore From DB</Dialog.Title>
					<Dialog.Content>
						<Paragraph>Are you sure you want to Restore From DB?</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideRestoreModal}>No</Button>
						<Button
							onPress={() => {
								hideRestoreModal();
								restoreMessages(currentUser);
							}}>
							Yes
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<Portal>
				<Modal
					visible={themeModalvisible}
					onDismiss={hidethemeModal}
					contentContainerStyle={{
						width: 420,
						maxWidth: "80%",
						// width: "50%",
						alignSelf: "center",
						backgroundColor: "white",
						borderRadius: 32,
					}}>
					<Drawer.Section showDivider={false} title="Theme Options">
						<RadioButton.Group
							onValueChange={(newValue) => setTheme(newValue)}
							value={theme}>
							<Drawer.Item
								label="Light"
								onPress={() => {
									setTheme("Light");
								}}
								right={() => <RadioButton value="Light" />}
							/>
							<Drawer.Item
								label="Dark"
								onPress={() => {
									setTheme("Dark");
								}}
								right={() => <RadioButton value="Dark" />}
							/>
							<Drawer.Item
								label="System-Default"
								onPress={() => {
									setTheme("System-Default");
								}}
								right={() => <RadioButton value="System-Default" />}
							/>
						</RadioButton.Group>
					</Drawer.Section>
				</Modal>
			</Portal>
		</ScrollView>
	);
}

const styles = StyleSheet.create({});
