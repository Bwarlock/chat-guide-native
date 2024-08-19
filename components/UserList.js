import { Avatar, Button, Icon, List, MD3Colors } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useUserHook } from "../api/hooks";

const UserList = ({ users, extra, extraText, extraFunction }) => {
	const { sendFriendRequest } = useUserHook();
	return (
		<List.Section>
			{users?.map((user, index) => {
				return (
					<List.Item
						key={index}
						style={{
							paddingHorizontal: 8,
							borderRadius: 16,
						}}
						onPress={
							extra
								? null
								: () => {
										console.log(user._id);
								  }
						}
						title={user?.name}
						description="latest message"
						left={() => (
							<Avatar.Image
								style={{
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: MD3Colors.secondary90,
								}}
								size={48}
								source={
									user?.image
										? user?.image
										: ({ size }) => {
												return <Icon source="account" size={32} />;
										  }
								}
							/>
						)}
						right={
							extra
								? () => (
										<View
											style={{
												flex: 1,
												justifyContent: "center",
											}}>
											<Button
												compact={true}
												onPress={() => {
													console.log(user._id);
													extraFunction({ id: user._id });
												}}
												mode="contained">
												{extraText}
											</Button>
										</View>
								  )
								: null
						}
					/>
				);
			})}
		</List.Section>
	);
};

export default UserList;
