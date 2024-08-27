import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import messageReducer from "./messageSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import { thunk } from "redux-thunk";

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	blacklist: ["global", "message"],
};

const messageConfig = {
	key: "message",
	storage: AsyncStorage,
	blacklist: [
		"isFetchingMissedMessages",
		"messageById",
		"messages",
		"fetchedFromDB",
	],
};

const globalConfig = {
	key: "global",
	storage: AsyncStorage,
	blacklist: [
		"friendRequests",
		"loading",
		"users",
		"friendsLoading",
		"requestLoading",
		"usersLoading",
	],
};

const rootReducer = combineReducers({
	global: persistReducer(globalConfig, globalReducer),
	message: persistReducer(messageConfig, messageReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(thunk),
});
export const persistor = persistStore(store);

// Store Definition
// const store = configureStore({
// 	reducer: {
// 		global: globalReducer,
// 		message: messageReducer,
// 	},
// });

// export default store;
