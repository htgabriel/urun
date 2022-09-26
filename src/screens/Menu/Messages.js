import React from "react";
import {WebView} from "react-native-webview";

export default function Messages(){
	return <WebView
		originWhitelist={['http://*', 'https://*']}
		source={{ uri: 'http://www.sistematreinoonline.com.br/novo/interface/historico_notificacao_app.php' }}
		style={{ marginTop: 0 }}
	/>
}