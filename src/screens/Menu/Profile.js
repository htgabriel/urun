import React from "react";
import {WebView} from "react-native-webview";

export default function Profile(){
	return <WebView
		originWhitelist={['http://*', 'https://*']}
		source={{ uri: 'http://www.sistematreinoonline.com.br/novo/interface/urun_menu_perfil.php' }}
		style={{ marginTop: 0 }}
	/>
}