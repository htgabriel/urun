import React from "react";
import {Text, View} from "react-native"

export default function Timer(props){
	return (
		<View>
			<Text>{("0" + Math.floor((props.time / 60000) % 60)).slice(-2)}:</Text>
			<Text>{("0" + Math.floor((props.time / 1000) % 60)).slice(-2)}.</Text>
			<Text>{("0" + ((props.time / 10) % 100)).slice(-2)}</Text>
		</View>
	)
}