import React from "react";
import {Text, TouchableOpacity, View} from "react-native"

export default function ControlButtons(props){
	const StartButton = (
		<TouchableOpacity
			onPress={props.handleStart}
		>
			<Text>{"Start"}</Text>
		</TouchableOpacity>
	)
	
	const ActiveButtons = (
		<>
			<TouchableOpacity
				onPress={props.handleReset}
			>
				<Text>{"Reset"}</Text>
			</TouchableOpacity>
			
			<TouchableOpacity
				onPress={props.handlePauseResume}
			>
				<Text>{props.isPaused ? "Resume" : "Pause"}</Text>
			</TouchableOpacity>
		</>
	)
	
	return (
		<View>
			{props.active ? ActiveButtons : StartButton}
		</View>
	)
}