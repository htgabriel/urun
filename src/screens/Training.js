import React from "react";
import {WebView} from "react-native-webview";

export default function Training(){
    return <WebView
        originWhitelist={['http://*', 'https://*']}
        source={{ uri: 'https://www.sistematreinoonline.com.br/novo/interface/index_treino.php?emp=1507&atleta=784&tecnicoto=1&app=2' }}
        style={{ marginTop: 0 }}
    />
};