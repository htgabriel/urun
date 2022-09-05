import Toast from "react-native-toast-message";

function ErrorMessage(message){
	Toast.show({
		text1: "Erro!",
		text2: message,
		position: "bottom",
		autoHide: true,
		visibilityTime: 5000,
		type: "error",
	})
}

function SuccessMessage(message){
	Toast.show({
		text1: "Sucesso!",
		text2: message,
		position: "bottom",
		autoHide: true,
		visibilityTime: 5000,
		type: "success",
	})
}

export {
	ErrorMessage,
	SuccessMessage
}