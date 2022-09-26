import React from "react";
import { StyleSheet, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function PasswordRecovery(){
	return(
		<LinearGradient
			colors={['#090f20', '#0f2048']}
			style={styles.container}
		>
			<Text style={{color: "#fff"}}>{"Recuperar Senha"}</Text>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
})