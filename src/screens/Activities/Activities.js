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
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import {ErrorMessage} from "../../helpers/HandleMessages";
import Dialog from "react-native-dialog"
import {useNavigation} from "@react-navigation/native";
import moment from "moment";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 0;
const LONGITUDE = 0;

export default function Activities({route: {params: {type}}}) {
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
    const [modalVisible, setModalVisible] = useState(false)
    const navigation = useNavigation()
    const [actualPace, setActualPace] = useState({
        distanceTravelledRounded: 0,
        elapsedTime: 0,
    })
    const [intervals, setIntervals] = useState([])
    
    useEffect(() => {
        (async () => {
            // await ReactNativeForegroundService.stop()
            // ReactNativeForegroundService.remove_all_tasks()
            // Geolocation.stopObserving()
            
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
        
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    const grantedBackground = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                        {
                            title: "Permiss??o de Acesso ?? Localiza????o",
                            message: `Para que o aplicativo funcione corretamente, ?? necess??rio que a op????o de localiza????o esteja marcada como "Permitir Sempre"`,
                            // buttonNeutral: "Pergunte-me depois",
                            buttonNegative: "Recusar",
                            buttonPositive: "Aceitar",
                        }
                    );
                    
                    if(grantedBackground === PermissionsAndroid.RESULTS.GRANTED){
                        getLocation();
                    }
                }else{
                    ErrorMessage("Permiss??o de localiza????o negada.")
                }
            }catch (e){
                ErrorMessage(e.toString())
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
    
    // CALCULA O RITMO ATUAL DE ACORDO COM A DISTANCIA PERCORRIDA E O TEMPO
    useEffect(() => {
        const distanceTravelledRounded = parseInt(distanceTravelled)
    
        if(distanceTravelledRounded > actualPace?.distanceTravelledRounded){
            let count = distanceTravelledRounded - 1
            let lastTotalDuration = intervals.filter(v => v.distance === count)[0]?.totalDuration
            
            setIntervals(intervals => [...intervals, {
                date: moment().utcOffset("-0300").format("YYYY-MM-DD HH:mm:ss"),
                distance: distanceTravelledRounded,
                totalDuration: formatTimeString(elapsedTime, null),
                // intervalDuration: lastTotalDuration ? formatTimeString(elapsedTime - lastTotalDuration, null) : formatTimeString(elapsedTime, null),
                pace: formatTimeString(elapsedTime - actualPace.elapsedTime)
            }])
    
            setActualPace({
                distanceTravelledRounded,
                elapsedTime: elapsedTime - actualPace.elapsedTime
            })
        }
    }, [routeCoordinates])
    
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
            error => {
                if(error.code === 3){
                    setModalVisible(true);
                }else{
                    ErrorMessage(error.message)
                }
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }
    
    function calcDistance(newLatLng, prevLatLng){
        return haversine(prevLatLng, newLatLng) || 0;
    }
    
    async function _handleStart(){
        try{
            if(!ReactNativeForegroundService.is_running()){
                await ReactNativeForegroundService.start({
                    id: 144,
                    title: "uRun",
                    message: `Monitorando sua atividade`,
                    vibration: false,
                    importance: 1
                });
            }
            
            Geolocation.watchPosition(
                async ({coords: {latitude, longitude}}) => {
                    const newCoordinate = {latitude, longitude}

                    if (Platform.OS === "android") {
                        if (marker) {
                            marker.animateMarkerToCoordinate(
                                newCoordinate,
                                500
                            )
                        }

                        setNewCoordinate(newCoordinate)
                    } else {
                        coordinate.timing(newCoordinate).start();
                    }

                    // await ReactNativeForegroundService.update({
                    //     id: 144,
                    //     title: "Current Position",
                    //     message: `${newCoordinate.latitude} ${newCoordinate.longitude}`,
                    //     vibration: false
                    // })
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
        }catch (e) {
            console.log("Error -> ", e.toString())
        }
    }
    
    async function _handlePause(){
        clearInterval(timer)
        setIsRunning(false)
        setIsPaused(true)
        Geolocation.stopObserving()
        await ReactNativeForegroundService.stop()
    }
    
    function _handleFinish(){
        const startTime = moment(startTime).utcOffset("-0300").format("YYYY-MM-DD HH:mm:ss")
        const endTime = moment(startTime).add(parseInt(elapsedTime/1000), "seconds").format("YYYY-MM-DD HH:mm:ss")
        const dataWebService = {
            points: routeCoordinates,
            distance: distanceTravelled,
            start: startTime,
            end: endTime,
            duration: formatTimeString(elapsedTime, null),
            intervals,
            mediumPace: convertNumToTime(mediumPace),
            type
        }
        
        setIsRunning(false)
        setIsPaused(false)
        setElapsedTime(0)
        setDistanceTravelled(0)
        setModalVisible(false)
        clearInterval(timer)
        Geolocation.stopObserving()
        
        console.log(JSON.stringify(dataWebService))
    }
    
    async function _handleMap(){
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        )
    
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setMapOpen(!mapIsOpen)
        }else{
            ErrorMessage("Permiss??o de localiza????o negada.")
        }
    }
    
    return (
        <View style={styles.container}>
            {routeCoordinates.length ? (
                <TouchableOpacity
                    style={styles.btnMap}
                    onPress={_handleMap}
                >
                    <Icon
                        size={40}
                        color={mapIsOpen ? "#ef4e36" : "#bdbfc1"}
                        name={"map-marker-alt"}
                    />
                </TouchableOpacity>
            ) : null}
            
            {mapIsOpen &&
                <ActivitiesMap
                    location={location}
                    pin={newCoordinate}
                    setMarker={setMarker}
                    coordinatesTravelled={routeCoordinates}
                />
            }
    
            <Dialog.Container visible={modalVisible}>
                <Dialog.Title>Localiza????o indispon??vel</Dialog.Title>
                <Dialog.Description>
                    A precis??o do GPS est?? fraca no seu local atual.
                    Para que o aplicativo consiga monitorar seu progresso corretamente,
                    ?? necess??rio que voc?? esteja ao ar livre, com uma linha direta de vis??o para o c??u.
                    Voc?? pode continuar, mas sua atividade talvez n??o tenha precis??o.
                </Dialog.Description>
                <Dialog.Button label="Continuar" onPress={() => setModalVisible(false)} />
                <Dialog.Button label="Suspender" onPress={() => navigation.navigate("MenuActivities")} />
            </Dialog.Container>
            
            <View style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: mapIsOpen ? "row" : "column"}}>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 22 : 18}]}>TEMPO</Text>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 70 : 35}]}>{formatTimeString(elapsedTime, null)}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 25 : 18, fontWeight: "600"}]}>DIST??NCIA (km) </Text>
                        <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 70 : 35}]}>{parseFloat(distanceTravelled).toFixed(2)}</Text>
                    </View>
                </View>
                
                <View style={{flex: 1, flexDirection: mapIsOpen ? "row" : "column"}}>
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"}}>
                        {!mapIsOpen ?
                            <View style={{alignItems: "center"}}>
                                <Text style={[styles.timerText, {fontSize: 18}]}>RITMO ATUAL</Text>
                                <Text style={[styles.timerText, {fontSize: 40}]}>{actualPace?.elapsedTime ? formatTimeString(actualPace?.elapsedTime, null) : '00:00'}</Text>
                            </View> : null
                        }
    
                        <View style={{alignItems: "center"}}>
                            <Text style={[styles.timerText, {fontSize: !mapIsOpen ? 18 : 18}]}>RITMO M??DIO</Text>
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