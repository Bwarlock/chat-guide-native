import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
	currentUser: {},
	users: [],
	friends: [],
	friendRequests: {
		received: [],
		sent: [],
	},
	loading: false,
	friendsLoading: false,
	requestLoading: false,
	usersLoading: false,
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
		setFriendsLoading: (state, action) => {
			state.friendsLoading = action.payload;
		},
		setRequestLoading: (state, action) => {
			state.requestLoading = action.payload;
		},
		setUsersLoading: (state, action) => {
			state.usersLoading = action.payload;
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
	setFriendsLoading,
	setRequestLoading,
	setUsersLoading,
} = globalSlice.actions;
export default globalSlice.reducer;
