import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Button({children, onPress, size, label, type}){
	
	const btnStyle = () => {
		switch (type){
			case "Start":
				return {
					borderWidth: 5,
					borderColor: "#00a859",
					backgroundColor: "#00a859"
				}
			case "Pause":
				return {
					width: size === "small" ? 80 : styles.btn.width,
					height: size === "small" ? 80 : styles.btn.width,
					borderWidth: 5,
					borderColor: "#ed3237",
					backgroundColor: "#FFFFFF"
				}
			case "Resume":
				return {
					width: size === "small" ? 80 : styles.btn.width,
					height: size === "small" ? 80 : styles.btn.width,
					borderWidth: 5,
					borderColor: "#00a859",
					backgroundColor: "#FFFFFF"
				}
			case "Finish":
				return {
					width: size === "small" ? 80 : styles.btn.width,
					height: size === "small" ? 80 : styles.btn.width,
					backgroundColor: "#f58634",
					marginLeft: 15
				}
			default: return {
			
			}
		}
	}
	
	return(
		<TouchableOpacity
			style={[styles.btn, {
				width: size === "small" ? 80 : styles.btn.width,
				height: size === "small" ? 80 : styles.btn.width,
				...btnStyle()
			}]}
			onPress={onPress}
		>
			{label &&
				<Text
					style={{
						fontSize: size === "small" ? 12 : styles.btnText.fontSize,
						color: "#ffffff"
					}}
				>
					{label}
				</Text>
			}
			
			{children}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	btn: {
		width: 120,
		height: 120,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000",
		borderRadius: 60,
	},
	btnText: {
		fontSize: 18,
		color: "#FFF"
	}
})