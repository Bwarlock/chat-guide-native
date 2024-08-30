import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
	token: "",
	theme: "Light",
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
		storeToken: (state, action) => {
			state.token = action.payload;
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
		storeTheme: (state, action) => {
			state.theme = action.payload;
		},
		storePrivate: (state, action) => {
			state.currentUser.private = action.payload;
		},
	},
});

export const {
	storeToken,
	storeCurrentUser,
	storeUsers,
	storeFriends,
	storeFriendRequests,
	clearGlobal,
	globalLoading,
	setFriendsLoading,
	setRequestLoading,
	setUsersLoading,
	storeTheme,
	storePrivate,
} = globalSlice.actions;
export default globalSlice.reducer;
