import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import createStackNavigator from "react-native-screens/createNativeStackNavigator";
import Login from "./screens/Login";

const Stack = createStackNavigator()

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name={"Login"}
					component={Login}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App;