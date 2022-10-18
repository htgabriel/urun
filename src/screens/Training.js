import React, {useContext} from "react";
import {WebView} from "react-native-webview";
import UserContext from "../contexts/UserContext";

export default function Training(){
    const {user} = useContext(UserContext)
    
    return <WebView
        originWhitelist={['http://*', 'https://*']}
        source={{ uri: `https://www.sistematreinoonline.com.br/novo/interface/urun_treinamento.php?emp=8254&atleta=${user?.id}&app=2&tecnicoto=1` }}
        style={{ marginTop: 0 }}
    />
};