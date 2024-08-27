import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";

export const fetchMessagesFromDB = createAsyncThunk(
	"message/fetchMessagesFromDB",
	async ({ id, func = () => {} }, { getState, rejectWithValue }) => {
		try {
			const state = getState();
			if (state.message.fetchedFromDB[id]) {
				func();
				return rejectWithValue(
					"Already Fetched " + state.message.fetchedFromDB[id]
				);
			}
			const checkMessages = new Set(state.message.messages[id] ?? []);
			const oldmessages = JSON.parse(await AsyncStorage.getItem(id));
			const messages = [];
			const messageById = {};
			if (oldmessages?.length) {
				for (let i = 0; i < oldmessages?.length; i++) {
					if (!checkMessages.has(oldmessages[i])) {
						const msg = JSON.parse(await AsyncStorage.getItem(oldmessages[i]));
						messageById[oldmessages[i]] = msg;
						messages.push(oldmessages[i]);
					}
				}
			}
			console.log(oldmessages, "fetchinggg");
			console.log(messageById, "fetchinggg");
			func();
			return { id, messages, messageById };
		} catch (error) {
			console.log("fetch error ", error);
			// Alert.alert("Error", error?.message);
			return error;
		}
	}
);

export const storeMessages = createAsyncThunk(
	"message/storeMessages",
	async (payload, { getState }) => {
		try {
			const state = getState();
			const { id, messages, messageById } = payload;
			// DB AINT WORKING , WHY DO THESE ABSTRACTION LAYERs DECIDE TO CHEANGE SHIT SO SOON
			// Friend chat added with message id

			// insertOrUpdateKeyValue(
			// 	id,
			// 	JSON.stringify([...(state["message"].messages[id] || []), ...messages])
			// );

			// More Messages to save per id
			// Object.keys(messageById).forEach((key) => {
			// 	insertOrUpdateKeyValue(key, JSON.stringify(messageById[key]));
			// });
			AsyncStorage.setItem(
				id,
				JSON.stringify([...(state["message"].messages[id] || []), ...messages])
			);
			Object.keys(messageById).forEach((key) => {
				AsyncStorage.setItem(key, JSON.stringify(messageById[key]));
			});

			return { id, messages, messageById };
		} catch (error) {
			console.log("thunk ", error);
			Alert.alert("Error", error?.message);
			return error;
		}
	}
);

const initialValue = {
	isFetchingMissedMessages: false,
	messageById: {},
	messages: {},
	latest: {},
	fetchedFromDB: {},
};

const messageSlice = createSlice({
	name: "message",
	initialState: initialValue,
	reducers: {
		// storeMessages: (state, action) => {
		// 	const { id, messages } = action.payload;
		// 	console.log(id, messages);
		// 	state.messages[id] = [...(state.messages[id] || []), ...messages];
		// },

		clearMessages: (state) => {
			return { ...initialValue };
		},
		clearSpecificMessages: (state, action) => {
			const id = action.payload;
			state.messages = {};
		},
		storeLatestMessage: (state, action) => {
			const { id, message } = action.payload;
			state.latest[id] = message;
		},
		storeFetchingCheck: (state, action) => {
			state.isFetchingMissedMessages = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(storeMessages.pending.type, (state, action) => {
			return state;
		});
		builder.addCase(storeMessages.fulfilled.type, (state, action) => {
			const { id, messages, messageById } = action.payload;
			state.messages[id] = [...(state.messages[id] || []), ...messages];
			state.messageById = { ...state.messageById, ...messageById };
		});
		builder.addCase(storeMessages.rejected.type, (state, action) => {
			return state;
		});

		builder.addCase(fetchMessagesFromDB.pending.type, (state, action) => {
			return state;
		});
		builder.addCase(fetchMessagesFromDB.fulfilled.type, (state, action) => {
			const { id, messages, messageById } = action.payload;
			console.log("asdasda-- ----------------------", state.fetchedFromDB[id]);

			state.messages[id] = [...messages, ...(state.messages[id] || [])];
			state.messageById = { ...state.messageById, ...messageById };
			state.fetchedFromDB[id] = true;
		});
		builder.addCase(fetchMessagesFromDB.rejected.type, (state, action) => {
			console.log("why");
			return state;
		});
	},
});

export const {
	// storeMessages,
	clearMessages,
	clearSpecificMessages,
	storeLatestMessage,
	storeFetchingCheck,
} = messageSlice.actions;
export default messageSlice.reducer;
