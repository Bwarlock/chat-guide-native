import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import messageReducer from "./messageSlice";

// Store Definition
const store = configureStore({
	reducer: {
		global: globalReducer,
		message: messageReducer,
	},
});

export default store;
