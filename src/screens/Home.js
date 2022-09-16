import React from "react";
import {WebView} from "react-native-webview";

export default function Home(){
	return <WebView
		originWhitelist={['http://*', 'https://*']}
		source={{ uri: 'https://www.sistematreinoonline.com.br/novo/interface/urun_home.php' }}
		style={{ marginTop: 0 }}
	/>
};