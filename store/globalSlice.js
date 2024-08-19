import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
	currentUser: {},
	users: [
		{
			_id: "sda",
			name: "Someone",
		},
		{
			_id: "sd",
			name: "Someone",
		},
	],
	friends: [
		{
			_id: "sda",
			name: "Someone",
		},
		{
			_id: "sd",
			name: "Someone",
		},
	],
	friendRequests: [],
	loading: false,
};

const globalSlice = createSlice({
	name: "global",
	initialState: initialValue,
	reducers: {
		storeCurrentUser: (state, action) => {
			state.currentUser = action.payload;
		},
		clearGlobal: (state) => {
			return { ...initialValue };
		},
		storeUsers: (state, action) => {
			state.users = action.payload;
		},
		storeFriends: (state, action) => {
			state.friends = action.payload;
		},
		storeFriendRequests: (state, action) => {
			state.friendRequests = action.payload;
		},
		globalLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const {
	storeCurrentUser,
	storeUsers,
	storeFriends,
	storeFriendRequests,
	clearGlobal,
	globalLoading,
} = globalSlice.actions;
export default globalSlice.reducer;
