import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import {Activities, Challenges, Home, Login, MenuActivities, Training, VirtualRace} from "./screens/index.js";
import {UserProvider} from "./contexts/UserContext";
import {Image, TouchableOpacity, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const App = () => {
	const Header = () => {
		return (
			<LinearGradient
				colors={['#090f20', '#0f2048']}
				style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, height: 50}}
			>
				<TouchableOpacity
					onPress={() => console.log("menu")}
				>
					<FontAwesome5Icon color={"#2a569f"} size={30} name={"bars"} />
				</TouchableOpacity>
				
				<Image style={{width: 100, height: 25}} source={require("./assets/logo.png")} />
				
				<TouchableOpacity
					onPress={() => console.log("message")}
				>
					<Ionicons color={"#2a569f"} size={30} name={"chatbox-outline"} />
				</TouchableOpacity>
				
				<TouchableOpacity
					onPress={() => console.log("profile")}
				>
					<FontAwesomeIcon color={"#2a569f"} size={30} name={"user-circle-o"} />
				</TouchableOpacity>
			</LinearGradient>
		)
	}
	
	const AuthRoutes = () => {
		return (
			<Stack.Navigator
				screenOptions={{
					headerShown: false
				}}
			>
				<Stack.Screen
					name={"Login"}
					component={Login}
				/>
				
				<Stack.Screen
					name={"SignedRoutes"}
					component={SignedRoutes}
				/>
			</Stack.Navigator>
		)
	}
	
	const SignedRoutes = () => {
		return (
			<BottomTab.Navigator
				initialRouteName="Home"
				screenOptions={({ route }) => ({
					header: () => <Header />,
					tabBarActiveBackgroundColor: "#e6e7e8",
					tabBarInactiveTintColor: "#bdbfc1",
					tabBarInactiveBackgroundColor: "#e6e7e8",
					tabBarShowLabel: false,
					tabBarIcon: ({ focused, size, color }) => {
						let iconName;
						if (route.name === "Home")                  iconName = "home";
						else if (route.name === "VirtualRace")      iconName = "running";
						else if (route.name === "ActivitiesRoutes") iconName = "stopwatch";
						else if (route.name === "Challenges")       iconName = "star";
						else if (route.name === "Training")         iconName = "run-fast";
						
						size = focused ? 40 : 30;
						color = focused ? '#ef4e36' : '#bdbfc1';
						return (
							<>
								{route.name === "Training" ? (
									<MaterialCommunityIcons
										name={iconName}
										size={size}
										color={color}
									/>
								) : (
									<FontAwesome5Icon
										name={iconName}
										size={size}
										color={color}
									/>
								)}
							</>
						)
					}
				})}
			>
				<BottomTab.Screen
					name={"Home"}
					component={Home}
				/>
				<BottomTab.Screen
					name={"VirtualRace"}
					component={VirtualRace}
				/>
				<BottomTab.Screen
					name={"ActivitiesRoutes"}
					component={ActivitiesRoutes}
				/>
				<BottomTab.Screen
					name={"Challenges"}
					component={Challenges}
				/>
				<BottomTab.Screen
					name={"Training"}
					component={Training}
				/>
			</BottomTab.Navigator>
		);
	}
	
	const ActivitiesRoutes = () => {
		return (
			<Stack.Navigator
				screenOptions={{
					headerShown: false
				}}
			>
				<Stack.Group>
					<Stack.Screen
						name={"MenuActivities"}
						component={MenuActivities}
					/>
					<Stack.Screen
						name={"Activities"}
						component={Activities}
					/>
				</Stack.Group>
			</Stack.Navigator>
		)
	}
	
	return (
		<NavigationContainer>
			<UserProvider>
				<AuthRoutes />
			</UserProvider>
		
			<Toast />
		</NavigationContainer>
	);
}

export default App;