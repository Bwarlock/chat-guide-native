import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Keyboard,
} from "react-native";
import {
	Appbar,
	TextInput,
	IconButton,
	Avatar,
	Button,
	List,
} from "react-native-paper";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

import { launchCamera } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { storeLatestMessage, storeMessages } from "../store/messageSlice";
import { useMessageHook } from "../api/hooks";

export default function ChatMessageScreen() {
	const [message, setMessage] = useState("");
	const { latest, messages } = useSelector((state) => state.message);
	const { currentUser } = useSelector((state) => state.global);
	const [showEmojiSelector, setShowEmojiSelector] = useState(false);
	const { createMessage, getMessages } = useMessageHook();

	const dispatch = useDispatch();
	const route = useRoute();
	const navigation = useNavigation();
	const scrollViewRef = useRef(null);

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<Appbar.Header>
					<Appbar.BackAction onPress={() => navigation.goBack()} />
					<Appbar.Content title={route.name} />
					<Appbar.Action
						icon={"refresh"}
						onPress={() => {
							getMessages();
						}}
					/>
				</Appbar.Header>
			),
		});
	}, []);
	useEffect(() => {
		scrollToBottom();
	}, []);

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
				recipientId: route.params.id,
				messageType: "text",
				message: message,
			});
			console.log(message);
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
		<KeyboardAvoidingView
			style={{
				flex: 1,
			}}>
			<ScrollView
				onContentSizeChange={handleContentSizeChange}
				ref={scrollViewRef}
				contentContainerStyle={{
					flexGrow: 1,
					padding: 8,
				}}>
				<List.Section>
					{messages[route.params.id]?.map((msg, index) => {
						return (
							<List.Item
								key={index}
								style={{
									paddingHorizontal: 8,
									borderRadius: 16,
									flexWrap: "wrap",
								}}
								title={msg?.message}
								left={() => <Avatar.Text size={32} label="U" />}
							/>
						);
					})}
				</List.Section>
				{/* {messages.map((msg) => (
					<View key={msg.id} style={styles.message}>
						{msg.text && <Avatar.Text size={24} label="U" />}
						{msg.image && (
							<Avatar.Image size={24} source={{ uri: msg.image }} />
						)}
						<View style={styles.messageContent}>
							{msg.text && <Button>{msg.text}</Button>}
							{msg.image && (
								<Avatar.Image size={100} source={{ uri: msg.image }} />
							)}
						</View>
					</View>
				))} */}
			</ScrollView>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 4,
					paddingVertical: 4,
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
			</View>

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
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	messagesContainer: {
		flex: 1,
		paddingHorizontal: 10,
		paddingTop: 20,
	},
	message: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	messageContent: {
		// marginLeft: 10,
		flexDirection: "column",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	textInput: {
		flex: 1,
	},
});
