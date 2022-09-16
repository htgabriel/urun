import React from "react";
import {WebView} from "react-native-webview";

export default function Challenges(){
    return <WebView
        originWhitelist={['http://*', 'https://*']}
        source={{ uri: 'https://www.sistematreinoonline.com.br/novo/interface/urun_desafio.php' }}
        style={{ marginTop: 0 }}
    />
};