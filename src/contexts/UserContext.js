import React, {createContext, useState} from "react";
import api from "../utils/api";
import {useNavigation} from "@react-navigation/native";
import {ErrorMessage} from "../helpers/HandleMessages";
// import {API_EMP, API_KEY} from "@env";

const UserContext = createContext({})

export const UserProvider = ({children}) => {
	const [user, setUser] = useState(null)
	const navigation = useNavigation();
	
	async function Login(cpf, password){
		if(!cpf || !password) return ErrorMessage("CPF ou senha não informados")
		
		try{
			const {data} = await api.get("/webservice/app_login.php", {
				params: {
					email: cpf,
					senha: password,
					emp: 1507,
					key: "T6G33RJAAG4LPG5VT"
				}
			})
			setUser(data)
			
			if(data?.status !== "falha"){
				navigation.navigate("SignedRoutes")
				
				return user
			}else{
				ErrorMessage("CPF ou senha incorretos")
			}
		}catch (e){
			ErrorMessage(e.toString())
		}
	}
	
	return (
		<UserContext.Provider
			value={{
				signed: !!user,
				user,
				Login
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export default UserContext