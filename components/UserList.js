import { Avatar, Icon, List, MD3Colors } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const UserList = ({ users }) => {
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
						onPress={() => {
							console.log(user?._id);
						}}
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
					/>
				);
			})}
		</List.Section>
	);
};

export default UserList;
