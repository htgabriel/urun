import React from "react";
import {WebView} from "react-native-webview";

export default function VirtualRace(){
    return <WebView
        originWhitelist={['http://*', 'https://*']}
        source={{ uri: ' https://www.sistematreinoonline.com.br/novo/interface/urun_cv.php' }}
        style={{ marginTop: 0 }}
    />
}