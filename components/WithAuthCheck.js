import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { AuthCheckRoute, AuthStackRoute } from "../util/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WithAuthCheck = (Component) => {
	const navigation = useNavigation();
	// not needed as Axios 401 intercepter will authenticate accordingly
	useEffect(() => {
		const checkToken = async () => {
			try {
				const token = await AsyncStorage.getItem("token");

				if (!token) {
					navigation.reset({
						index: 0,
						routes: [{ name: AuthCheckRoute }],
					});
				}
			} catch (e) {
				Alert.alert("Error", e?.message);
			}
		};

		checkToken();
	}, [navigation]);

	return (props) => {
		return <Component {...props} />;
	};
};

export default WithAuthCheck;
