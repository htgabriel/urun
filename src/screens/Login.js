import React, {useContext, useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, TextInput} from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import UserContext from "../contexts/UserContext";
import {getItem} from "../helpers/AsyncStorage";

export default function Login({navigation}){
	const [cpf, setCpf] = useState()
	const [password, setPassword] = useState()
	const {Login} = useContext(UserContext);
	
	useEffect(() => {
		(async () => {
			const cpf = await getItem("@userCPF")
			const password = await getItem("@userPassword")
			
			setCpf(cpf)
			setPassword(password)
			if(cpf && password){
				Login(cpf, password)
			}
		})()
	}, [])
	
	return (
		<LinearGradient
			colors={['#090f20', '#0f2048']}
			style={styles.container}
		>
			
			<View style={styles.containerImage}>
				<Image
					style={styles.image}
					source={require("../assets/logo.png")}
				/>
			</View>
			
			<TextInput
				label={"CPF"}
				style={styles.input}
	            placeholder="Entre com seu CPF"
	            value={cpf}
	            onChangeText={setCpf}
			/>
			
			<TextInput
				label={"Senha"}
				style={styles.input}
	            placeholder="Entre com sua senha"
	            value={password}
	            onChangeText={setPassword}
	            secureTextEntry
			/>
			
			<Button
				mode={"contained"}
				buttonColor={"#09407a"}
				style={styles.btnLogin}
				onPress={() => Login && Login(cpf, password)}
			>
				{"Login"}
			</Button>
			
			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<TouchableOpacity
					onPress={() => navigation.navigate("Register")}
				>
					<Text style={styles.textActions}>{"Cadastre-se"}</Text>
				</TouchableOpacity>
				
				<TouchableOpacity
					onPress={() => navigation.navigate("PasswordRecovery")}
				>
					<Text style={styles.textActions}>{"Recuperar Senha"}</Text>
				</TouchableOpacity>
			</View>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		flex: 1,
		justifyContent: "center",
		padding: 10
	},
	input: {
		marginVertical: 10
	},
	btnLogin: {
		marginVertical: 10
	},
	containerImage: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 15
	},
	image: {
		width: 200,
		height: 50
	},
	textActions: {
		fontSize: 14,
		color: "#FFF"
	}
})