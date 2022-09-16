import React from "react";
import {WebView} from "react-native-webview";

export default function Training(){
    return <WebView
        originWhitelist={['http://*', 'https://*']}
        source={{ uri: 'https://www.sistematreinoonline.com.br/novo/interface/urun_treino.php' }}
        style={{ marginTop: 0 }}
    />
};