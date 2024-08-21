import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
	messages: {},
	latest: {},
};

const messageSlice = createSlice({
	name: "message",
	initialState: initialValue,
	reducers: {
		storeMessages: (state, action) => {
			const { id, messages } = action.payload;
			state.messages[id] = [...(state.messages[id] || []), ...messages];
		},
		clearMessages: (state) => {
			return { ...initialValue };
		},
		storeLatestMessage: (state, action) => {
			const { id, message } = action.payload;
			state.latest[id] = message;
		},
	},
});

export const { storeMessages, clearMessages, storeLatestMessage } =
	messageSlice.actions;
export default messageSlice.reducer;
