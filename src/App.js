import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Activities, Challenges, Home, Login, MenuActivities, Training, VirtualRace} from "./screens/index.js";
import {UserProvider} from "./contexts/UserContext";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const App = () => {
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
					headerShown: false,
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
									<Icon
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
		</NavigationContainer>
	);
}

export default App;