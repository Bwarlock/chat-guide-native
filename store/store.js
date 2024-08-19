import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";

// Store Definition
const store = configureStore({
	reducer: {
		global: globalReducer,
	},
});

export default store;
