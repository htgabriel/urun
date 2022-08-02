import React, {useContext, useState} from "react";
import {StyleSheet} from "react-native";
import {Button, TextInput} from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import UserContext from "../contexts/UserContext";

export default function Login(){
	const [cpf, setCpf] = useState(true ? "075.996.788-16" : "")
	const [password, setPassword] = useState(true ? "atleta" : "")
	const {Login} = useContext(UserContext);
	
	return (
		<LinearGradient
			colors={['#090f20', '#0f2048']}
			style={styles.container}
		>
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
})