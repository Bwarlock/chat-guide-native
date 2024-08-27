import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Keyboard,
	FlatList,
} from "react-native";
import {
	Appbar,
	TextInput,
	IconButton,
	Avatar,
	Button,
	List,
	Chip,
	Text,
	Card,
	Surface,
	TouchableRipple,
	MD3Colors,
	ActivityIndicator,
	Icon,
	Menu,
} from "react-native-paper";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

import { launchCamera } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchMessagesFromDB,
	storeLatestMessage,
	storeMessages,
} from "../store/messageSlice";
import { useMessageHook } from "../api/hooks";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function ChatMessageScreen() {
	const [menuVisible, setMenuVisible] = useState(false);
	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const { latest, messages, messageById } = useSelector(
		(state) => state.message
	);
	const { currentUser } = useSelector((state) => state.global);
	const [showEmojiSelector, setShowEmojiSelector] = useState(false);
	const { createMessage, fetchMissedMessages } = useMessageHook();

	const dispatch = useDispatch();
	const route = useRoute();
	const user = route.params.user;

	const navigation = useNavigation();
	const scrollViewRef = useRef(null);

	const lastMessageDate = useRef(null);

	useEffect(() => {
		(async () => {
			dispatch(
				fetchMessagesFromDB({
					id: user._id,
					func: () => {
						setLoading(false);
					},
				})
			);
		})();
		console.log(user);
	}, []);

	const getDateLabel = (date) => {
		const today = new Date();
		const messageDate = new Date(date);
		const diffDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return "Today";
		} else if (diffDays === 1) {
			return "Yesterday";
		} else {
			return messageDate.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			});
		}
	};

	useLayoutEffect(() => {
		scrollToBottom();
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					<Appbar.BackAction onPress={() => navigation.goBack()} />
					{/* <Appbar.Content title={route.name + " " + user.name} /> */}
					<Appbar.Content
						title={
							<List.Item
								style={{
									margin: 8,
									alignItems: "center",
								}}
								onPress={() => {
									console.log("sad");
								}}
								titleStyle={{
									fontSize: 14,
								}}
								descriptionStyle={{
									fontSize: 10,
								}}
								title={user.name}
								description={"@" + user.username}
								left={() => (
									<Avatar.Image
										style={{
											margin: 0,
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: MD3Colors.secondary90,
										}}
										size={36}
										source={
											user?.image
												? user?.image
												: ({ size }) => {
														return <Icon source="account" size={24} />;
												  }
										}
									/>
								)}
							/>
						}
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
						<Menu.Item onPress={() => {}} title="Menu Item" />
					</Menu>
				</Appbar.Header>
			),
		});
	}, [menuVisible]);

	const scrollToBottom = () => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: false });
		}
	};

	const handleContentSizeChange = () => {
		scrollToBottom();
	};

	const handleSend = () => {
		if (message.trim()) {
			createMessage({
				senderId: currentUser._id,
				recipientId: user._id,
				messageType: "text",
				message: message,
			});
			console.log(message, "cha ascreen");
		}
		setMessage("");
	};
	const handleToggleEmojiPicker = () => {
		if (showEmojiSelector) {
			// Hide emoji picker and show keyboard
			setShowEmojiSelector(false);
			Keyboard.dismiss();
		} else {
			// Show emoji picker and hide keyboard
			Keyboard.dismiss();
			setTimeout(() => {
				setShowEmojiSelector(true);
			}, 0);
		}
	};
	const handlePickImage = () => {
		launchCamera({}, (response) => {
			if (!response.didCancel && !response.error) {
				setMessages([
					...messages,
					{ image: response.assets[0].uri, id: messages.length },
				]);
			}
		});
	};

	return (
		<>
			{loading ? (
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<ActivityIndicator animating={true} />
				</View>
			) : (
				<KeyboardAvoidingView
					style={{
						flex: 1,
					}}>
					<FlatList
						ref={scrollViewRef}
						onContentSizeChange={handleContentSizeChange}
						contentContainerStyle={{
							flexGrow: 1,
							padding: 8,
						}}
						data={messages[user._id] ?? []}
						renderItem={({ item: key }) => {
							const item = messageById[key] ?? {};
							const messageDate = new Date(item?.createdAt).toDateString();
							const showDateLabel = messageDate !== lastMessageDate.current;
							lastMessageDate.current = messageDate;

							return (
								<View>
									{showDateLabel && (
										<Text style={{ textAlign: "center", marginVertical: 4 }}>
											{getDateLabel(item?.createdAt)}
										</Text>
									)}
									<View
										style={{
											margin: 12,
											maxWidth: "75%",
											alignSelf:
												item?.senderId == currentUser._id
													? "flex-end"
													: "flex-start",
										}}>
										{/* want to add label here */}
										<Surface
											elevation={3}
											style={{
												borderRadius: 8,
												overflow: "hidden",
												backgroundColor:
													item?.senderId == currentUser._id
														? MD3Colors.primary90
														: MD3Colors.neutralVariant90,
											}}>
											<TouchableRipple
												style={{ padding: 8 }}
												onPress={() => {}}>
												<View>
													<Text
														variant="titleMedium"
														style={{
															flexShrink: 1, // Allows text to shrink if necessary
															wordBreak: "break-word",
														}}>
														{item?.message}
													</Text>
													<Text
														variant="labelSmall"
														style={{
															alignSelf:
																item?.senderId == currentUser._id
																	? "flex-end"
																	: "flex-start",
														}}>
														{new Date(item?.createdAt).toLocaleTimeString(
															"en-GB",
															{
																hour: "2-digit",
																minute: "2-digit",
																hour12: false,
															}
														)}
													</Text>
												</View>
											</TouchableRipple>
										</Surface>
									</View>
								</View>
							);
						}}
						keyExtractor={(item, index) => index}
						// contentContainerStyle={{}}
					/>

					<Surface
						theme={{ colors: { backdrop: "transparent" } }}
						style={{
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: 8,
							paddingVertical: 8,
						}}>
						<TextInput
							style={{
								flex: 1,
								padding: 4,
							}}
							outlineStyle={{
								borderRadius: 32,
							}}
							contentStyle={{
								textAlignVertical: "center",
							}}
							// dense={true}
							multiline={true}
							mode="outlined"
							placeholder="Type a message"
							value={message}
							onChangeText={setMessage}
							onFocus={() => {
								setShowEmojiSelector(false);
							}}
							left={
								<TextInput.Icon
									style={{
										marginTop: 16,
									}}
									icon={"emoticon"}
									onPress={handleToggleEmojiPicker}
								/>
							}
							right={
								<TextInput.Icon
									style={{
										marginTop: 16,
									}}
									icon={"camera"}
									onPress={handlePickImage}
								/>
							}
						/>
						<IconButton
							icon="send"
							style={{
								margin: 0,
								marginLeft: 4,
							}}
							size={44}
							mode="contained"
							onPress={handleSend}
						/>
					</Surface>

					{showEmojiSelector && (
						<EmojiSelector
							category={Categories.symbols}
							onEmojiSelected={(emoji) => {
								setMessage(message + emoji);
							}}
							style={{ height: 320 }}
						/>
					)}
				</KeyboardAvoidingView>
			)}
		</>
	);
}

const styles = StyleSheet.create({});
