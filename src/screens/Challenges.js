import React, {useContext} from "react";
import {WebView} from "react-native-webview";
import UserContext from "../contexts/UserContext";

export default function Challenges(){
    const {user} = useContext(UserContext)
    
    return <WebView
        originWhitelist={['http://*', 'https://*']}
        source={{ uri: `www.sistematreinoonline.com.br/novo/inteface/urun_conquistas.php?emp=8254&atleta=${user?.id}&app=2&tecnicoto=1` }}
        style={{ marginTop: 0 }}
    />
};