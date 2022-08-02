import React, {useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {formatTimeString} from "../../utils";
import ActivitiesMap from "./ActivitiesMap";


export default function Activities() {
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timer, setTimer] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(startTime || 0);
    const [mapOpen, setMapOpen] = useState(false)
    
    useEffect(() => {
        if(startTime){
            setTimer(setInterval(() => {
                setElapsedTime(new Date() - startTime)
            }, 100))
        }
    }, [startTime])
    
    const _handleTimer = async() => {
        setIsRunning(!isRunning)
        setStartTime(elapsedTime ? new Date() - elapsedTime : new Date)
        if(timer !== null){
            setIsPaused(false)
            setIsRunning(true)
        }
    }
    
    const _handlePause = () => {
        clearInterval(timer)
        setIsRunning(false)
        setIsPaused(true)
    }
    
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.btnMap}
                onPress={() => setMapOpen(!mapOpen)}
            >
                <Icon size={40} color={"#bdbfc1"} name={"map-marker-alt"} />
            </TouchableOpacity>
            
            {mapOpen &&
                <ActivitiesMap
                
                />
            }
            
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 40 }}>
                <Text style={[styles.chronoText, {fontSize: 20}]}>TEMPO</Text>
                <Text style={[styles.chronoText, {fontSize: 70}]}>{formatTimeString(elapsedTime, null)}</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 40 }}>
                <Text style={[styles.chronoText, {fontSize: 20}]}>DISTÂNCIA</Text>
                <Text style={[styles.chronoText, {fontSize: 100}]}>0,00</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20, flexDirection: "row",  }}>
                <View>
                    <Text style={[styles.chronoText, {fontSize: 15}]}>RITMO ATUAL</Text>
                    <Text style={[styles.chronoText, {fontSize: 40}]}>00:00</Text>
                </View>
                <View style={{paddingLeft: 70}}>
                    <Text style={[styles.chronoText, {fontSize: 15}]}>RITMO MÉDIO</Text>
                    <Text style={[styles.chronoText, {fontSize: 40}]}>00:00</Text>
                </View>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: 10 }}>
                {!isRunning || isPaused ?
                    <TouchableOpacity
                        style={[styles.btn, {
                            borderWidth: 5,
                            borderColor: "#00a859",
                            backgroundColor: isPaused ? "#FFFFFF" : "#00a859"
                        }]}
                        onPress={_handleTimer}
                    >
                        <Text
                            style={[styles.btnText, {
                                color: isPaused ? "#00a859" : "#ffffff"
                            }]}
                        >{isPaused ? "CONTINUAR" : "INICIAR"}</Text>
                    </TouchableOpacity> : null
                }

                {isPaused ?
                    <TouchableOpacity
                        style={[styles.btn, {backgroundColor: "#f58634", marginLeft: 15}]}
                        onPress={() => {
                            setIsRunning(false)
                            setIsPaused(false)
                        }}
                    >
                        <Text style={[styles.btnText, {color: "#ffffff"}]}>{"CONCLUIR"}</Text>
                    </TouchableOpacity> : null
                }

                {isRunning ?
                    <TouchableOpacity
                        style={[styles.btn, {backgroundColor: "#ed3237"}]}
                        onPress={_handlePause}
                    >
                        <Icon style={{color: "#FFF"}} name={"stop"} size={60}/>
                    </TouchableOpacity> : null
                }
            </View>
        </View>
    
    )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fefefe",
    },
    btn: {
        width: 120,
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        borderRadius: 60,
    },
    btnText: {
        fontSize: 18,
        color: "#FFF"
    },
    chronoText: {
        color: "#000",
        marginBottom: -10,
    },
    boxContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: -10,
    },
    btnMap: {
        position: "absolute",
        top: 0,
        right: 10,
        padding: 15,
        backgroundColor: "#e6e7e8",
        borderBottomStartRadius: 7,
        borderBottomEndRadius: 7
    },
    map: {
        // ...StyleSheet.absoluteFillObject
        flex: 1
    },
})