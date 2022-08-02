import React, {createContext, useState} from "react";
import api from "../utils/api";
import {useNavigation} from "@react-navigation/native";
// import {API_EMP, API_KEY} from "@env";

const UserContext = createContext({})

export const UserProvider = ({children}) => {
	const [user, setUser] = useState(null)
	const navigation = useNavigation();
	
	async function Login(cpf, password){
		try{
			const {data} = await api.get("/webservice/app_login.php", {
				params: {
					email: "075.996.788-16",
					senha: "atleta",
					emp: 1507,
					key: "T6G33RJAAG4LPG5VT"
				}
			})
			setUser(data)
			
			if(data?.status){
				navigation.navigate("SignedRoutes")
			}
			return user
		}catch (e){
			console.log(e.toString())
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