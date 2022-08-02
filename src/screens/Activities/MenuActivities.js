import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {Button} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";

export default function MenuActivities(){
    const navigation = useNavigation()
    
    const ButtonActivities = ({label}) => (
        <Button
            buttonColor={"#cddc3a"}
            mode={"contained"}
            style={styles.btnActivities}
            textColor={"#000"}
            labelStyle={{fontSize: 25}}
            onPress={() => navigation.navigate("Activities")}
        >
            {label}
        </Button>
    )
    
    return(
        <View style={styles.container}>
            <View style={styles.containerText}>
                <Text style={styles.title}>{"Selecione a atividade para iniciar"}</Text>
            </View>
            
            <ButtonActivities label={"CAMINHADA"} />
            <ButtonActivities label={"CORRIDA"} />
            <ButtonActivities label={"CICLISMO"} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#e6e7e8",
        marginBottom: 10
    },
    containerText: {
        alignItems: "center"
    },
    title: {
        fontSize: 20,
        fontWeight: "500"
    },
    btnActivities: {
        marginHorizontal: 20,
        marginVertical: 5,
    }
})