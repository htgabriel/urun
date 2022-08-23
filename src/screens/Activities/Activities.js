import React, {useEffect, useState} from "react";
import {PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import {formatTimeString, convertNumToTime} from "../../utils";
import ActivitiesMap from "./ActivitiesMap";
import Button from "../../components/Button";
import Geolocation from "@react-native-community/geolocation";
import {AnimatedRegion} from "react-native-maps";
import haversine from "haversine";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 0;
const LONGITUDE = 0;

export default function Activities() {
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timer, setTimer] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(startTime || 0);
    const [mapIsOpen, setMapOpen] = useState(false)
    const [location, setLocation] = useState({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })
    const [coordinate, setCoordinate] = useState(new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    }))
    const [routeCoordinates, setRouteCoordinates] = useState([])
    const [distanceTravelled, setDistanceTravelled] = useState(0)
    const [marker, setMarker] = useState(null)
    const [prevLatLng, setPrevLatLng] = useState({})
    const [newCoordinate, setNewCoordinate] = useState({})
    const [mediumPace, setMediumPace] = useState(0)
    const [currentPace, setCurrentPace] = useState(0)
    
    useEffect(() => {
        (async () => {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Permissão de Acesso à Localização",
                    message: "Este aplicativo precisa acessar sua localização.",
                    buttonNeutral: "Pergunte-me depois",
                    buttonNegative: "Cancelar",
                    buttonPositive: "OK"
                }
            );
    
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getLocation();
            }else{
                alert('Permissão de Localização negada');
            }
        })()
    }, [])
    
    useEffect(() => {
        if(startTime){
            setTimer(setInterval(() => {
                setElapsedTime(new Date() - startTime)
            }, 100))
        }
    }, [startTime])
    
    useEffect(() => {
        if(Object.keys(newCoordinate).length){
            setLocation({...location, ...newCoordinate})
            setDistanceTravelled(distanceTravelled + calcDistance(newCoordinate, prevLatLng))
            setPrevLatLng(newCoordinate)
            setRouteCoordinates(prevCoordinate => [...prevCoordinate, newCoordinate])
            
            if(distanceTravelled > 0.00) setMediumPace(elapsedTime/60000 / distanceTravelled)
        }
    }, [newCoordinate])
    
    function getLocation(){
        Geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                setLocation({
                    latitude, longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                })
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }
    
    function calcDistance(newLatLng, prevLatLng){
        return haversine(prevLatLng, newLatLng) || 0;
    }
    
    function _handleStart(){
        Geolocation.watchPosition(
            ({coords: {latitude, longitude}}) => {
                const newCoordinate = {latitude, longitude}
                
                if(Platform.OS === "android"){
                    if(marker){
                        marker.animateMarkerToCoordinate(
                            newCoordinate,
                            500
                        )
                    }
    
                    setNewCoordinate(newCoordinate)
                }else{
                    coordinate.timing(newCoordinate).start();
                }
            },
            error => console.log("error", error.toString()),
            {
                enableHighAccuracy: true,
                timeout: 500,
                maximumAge: 10000,
                distanceFilter: 1
            }
        )
        
        setIsRunning(!isRunning)
        setStartTime(elapsedTime ? new Date() - elapsedTime : new Date())
        if(timer !== null){
            setIsPaused(false)
            setIsRunning(true)
        }
    }
    
    function _handlePause(){
        clearInterval(timer)
        setIsRunning(false)
        setIsPaused(true)
        Geolocation.stopObserving()
    }
    
    function _handleFinish(){
        setIsRunning(false)
        setIsPaused(false)
        setElapsedTime(0)
        setDistanceTravelled(0)
        Geolocation.stopObserving()
    }
    
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.btnMap}
                onPress={() => setMapOpen(!mapIsOpen)}
            >
                <Icon
                    size={40}
                    color={"#bdbfc1"}
                    name={"map-marker-alt"}
                />
            </TouchableOpacity>
            
            {mapIsOpen &&
                <ActivitiesMap
                    location={location}
                    pin={newCoordinate}
                    setMarker={setMarker}
                    coordinatesTravelled={routeCoordinates}
                />
            }
            
            <View style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: mapIsOpen ? "row" : "column"}}>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 20 : 13}]}>TEMPO</Text>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 70 : 35}]}>{formatTimeString(elapsedTime, null)}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 20 : 13}]}>DISTÂNCIA (km) </Text>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 70 : 35}]}>{parseFloat(distanceTravelled).toFixed(2)}</Text>
                    </View>
                </View>
                
                <View style={{flex: 1, flexDirection: mapIsOpen ? "row" : "column"}}>
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"}}>
                        {!mapIsOpen ?
                            <View style={{alignItems: "center"}}>
                                <Text style={[styles.timerText, {fontSize: 15}]}>RITMO ATUAL</Text>
                                <Text style={[styles.timerText, {fontSize: 40}]}>00:00</Text>
                            </View> : null
                        }
    
                        <View style={{alignItems: "center"}}>
                            <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 15 : 13}]}>RITMO MÉDIO (km)</Text>
                            <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 40 : 35}]}>{convertNumToTime(mediumPace)}</Text>
                        </View>
                    </View>
                    
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                        {!isRunning && !isPaused &&
                            <Button
                                size={mapIsOpen ? "small" : "normal"}
                                type={"Start"}
                                label={"Iniciar"}
                                onPress={_handleStart}
                            />
                        }
                        
                        {isRunning &&
                            <Button
                                size={mapIsOpen ? "small" : "normal"}
                                type={"Pause"}
                                onPress={_handlePause}
                            >
                                <Ionicons style={{color: "#ed3237"}} name={"pause"} size={60}/>
                            </Button>
                            // <PauseButton size={mapIsOpen ? "small" : null} type={"End"} onPress={_handlePause} />
                        }
                        
                        {isPaused ? (
                            <>
                                <Button
                                    size={mapIsOpen ? "small" : "normal"}
                                    type={"Resume"}
                                    onPress={_handleStart}
                                >
                                    <Text
                                        style={{
                                            fontSize: mapIsOpen ? 12 : 18,
                                            color: "#00a859"
                                        }}
                                    >
                                        {"CONTINUAR"}
                                    </Text>
                                </Button>
    
                                <Button
                                    size={mapIsOpen ? "small" : "normal"}
                                    type={"Finish"}
                                    label={"CONCLUIR"}
                                    onPress={_handleFinish}
                                />
                            </>
                        ) : null}
                    </View>
                </View>
            </View>
        </View>
    
    )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fefefe",
    },
    btnMap: {
        position: "absolute",
        top: 0,
        right: 10,
        padding: 15,
        backgroundColor: "#e6e7e8",
        borderBottomStartRadius: 7,
        borderBottomEndRadius: 7,
        zIndex: 1
    },
    timerText: {
        color: "#000",
        marginBottom: -10,
    }
})