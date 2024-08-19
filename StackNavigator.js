import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, StyleSheet, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WithSafeArea from "./components/WithSafeArea";
import {
	AddFriendRoute,
	AppStackRoute,
	AuthCheckRoute,
	AuthStackRoute,
	FriendRequestsRoute,
	HomeRoute,
	LoginRoute,
	RegisterRoute,
	SettingsRoute,
} from "./util/routes";
import AuthCheck from "./components/AuthCheck";
import Settings from "./screens/Settings";
import AddFriend from "./screens/AddFriend";
import FriendRequests from "./screens/FriendRequests";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name={LoginRoute}
				component={WithSafeArea(LoginScreen)}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name={RegisterRoute}
				component={WithSafeArea(RegisterScreen)}
				// options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};

const AppStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name={HomeRoute} component={HomeScreen} />
			<Stack.Screen name={SettingsRoute} component={Settings} />
			<Stack.Screen name={AddFriendRoute} component={AddFriend} />
			<Stack.Screen name={FriendRequestsRoute} component={FriendRequests} />
		</Stack.Navigator>
	);
};

export default function StackNavigator() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name={AuthCheckRoute}
						component={WithSafeArea(AuthCheck)}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name={AuthStackRoute}
						component={AuthStack}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name={AppStackRoute}
						component={AppStack}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({});
