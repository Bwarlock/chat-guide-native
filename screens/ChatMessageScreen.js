import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Keyboard,
	FlatList,
	Alert,
	Image,
	Pressable,
	ImageBackground,
	SafeAreaView,
	TouchableHighlight,
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
	Portal,
} from "react-native-paper";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchMessagesFromDB,
	storeLatestMessage,
	storeMessages,
} from "../store/messageSlice";
import { useMessageHook } from "../api/hooks";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as ImagePicker from "expo-image-picker";
import { createUniqueIdentifier } from "../util/functions";
import * as FileSystem from "expo-file-system";
import ImageView from "react-native-image-viewing";

export default function ChatMessageScreen() {
	const [image, setImage] = useState();
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
	const { createMessage, fetchMissedMessages, getImage } = useMessageHook();

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

	const handlePickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				// aspect: [4, 3],
				quality: 1,
			});

			console.log(result.assets[0]);

			if (!result.canceled) {
				if (result.assets[0].fileSize > 10 * 1024 * 1024) {
					Alert.alert("Error", "Image can't be more than 5mb");
					return;
				}
				setImage(result.assets[0]);
			}
		} catch (error) {
			Alert.alert("Error", "Unable to PicK Image");
		}
	};

	const handleCameraImage = async () => {
		try {
			let result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				// aspect: [4, 3],
				quality: 1,
			});

			console.log(result);

			if (!result.canceled) {
				if (result.assets[0].fileSize > 10 * 1024 * 1024) {
					Alert.alert("Error", "Image can't be more than 10mb");
					return;
				}
				setImage(result.assets[0]);
			}
		} catch (error) {
			Alert.alert("Error", "Unable to Open Camera");
		}
	};

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
									paddingHorizontal: 8,
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
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: MD3Colors.secondary90,
										}}
										size={32}
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
						{/* <Menu.Item onPress={() => {}} title="Menu Item" /> */}
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
		if (message.trim() || image) {
			const data = {
				senderId: currentUser._id,
				recipientId: user._id,
				messageType: image ? "image" : "text",
				message: message,
				imageUrl: "", // self created uri
			};
			const imageData = {
				fileName: createUniqueIdentifier() + "_" + image?.fileName,
				fileSize: image?.fileSize,
				mimeType: image?.mimeType,
				uri: image?.uri,
			};
			createMessage(data, imageData);

			console.log(message, image, "cha ascreen");
		}
		setMessage("");
		setImage(null);
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

	const [imageVisible, setImageVisible] = useState(false);
	const [currentImage, setCurrentImage] = useState();
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
					<SafeAreaView>
						<ImageView
							images={currentImage}
							imageIndex={0}
							visible={imageVisible}
							onRequestClose={() => {
								setImageVisible(false);
								setCurrentImage([]);
							}}
						/>
					</SafeAreaView>
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
											elevation={1}
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
													{item?.messageType == "image" ? (
														item?.imageExist ? (
															<TouchableHighlight
																style={{
																	flexDirection: "row",
																	justifyContent:
																		item?.senderId == currentUser._id
																			? "flex-end"
																			: "flex-start",
																}}
																onPress={() => {
																	setCurrentImage([
																		{
																			uri:
																				FileSystem.documentDirectory +
																				item?.imageUrl,
																		},
																	]);
																	setImageVisible(true);
																}}>
																<Image
																	src={
																		FileSystem.documentDirectory +
																		item?.imageUrl
																	}
																	style={{
																		width: 120,
																		height: 120,
																	}}
																/>
															</TouchableHighlight>
														) : (
															<IconButton
																style={{
																	width: 120,
																	height: 120,
																}}
																icon={"download"}
																onPress={() => {
																	getImage(item);
																	console.log("pressing");
																	// image id
																	// message id
																	//  exists convert to true
																}}
															/>
														)
													) : (
														<></>
													)}

													<Text
														variant="titleMedium"
														style={{
															alignSelf:
																item?.senderId == currentUser._id
																	? "flex-end"
																	: "flex-start",
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
					{image && (
						<View
							style={{
								width: "100%",
								flexDirection: "row",
								justifyContent: "flex-end",
								alignItems: "center",
							}}>
							<Image
								source={{ uri: image?.uri || "" }}
								style={{
									width: 75,
									height: 75,
								}}
							/>
							<IconButton
								icon={"close"}
								onPress={() => {
									setImage(null);
								}}
							/>
						</View>
					)}
					<Surface
						style={{
							flexDirection: "row",
							alignItems: "flex-end",
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
									icon={"attachment"}
									onPress={handlePickImage}
								/>
								// <TextInput.Icon
								// 	style={{
								// 		marginTop: 16,
								// 	}}
								// 	icon={"emoticon"}
								// 	onPress={handleToggleEmojiPicker}
								// />
							}
							right={
								<TextInput.Icon
									style={{
										marginTop: 16,
									}}
									icon={"camera"}
									onPress={handleCameraImage}
								/>
							}
						/>
						<IconButton
							icon="send"
							style={{
								margin: 0,
								marginLeft: 4,
							}}
							size={48}
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
