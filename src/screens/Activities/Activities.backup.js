import React, {Component} from "react";
import {PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MapView, {AnimatedRegion, Marker, Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import haversine from "haversine";
import Geolocation from "@react-native-community/geolocation";
import Toast from "react-native-toast-message";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import {formatTimeString} from "../../utils"

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 0;
const LONGITUDE = 0;

class AnimatedMarkers extends Component {
	constructor(props) {
		super(props);
		const { startTime } = props;
		this.state = {
			latitude: LATITUDE,
			longitude: LONGITUDE,
			routeCoordinates: [],
			distanceTravelled: 0,
			prevLatLng: {},
			coordinate: new AnimatedRegion({
				latitude: LATITUDE,
				longitude: LONGITUDE,
				latitudeDelta: 0,
				longitudeDelta: 0
			}),
			timeCounter: 0,
			isRunning: false,
			timer: null,
			number: 0,
			minute: 0,
			fmtTimer: '00:00',
			fmtPace: '00:00',
			stopwatchStart: false,
			stopwatchReset: false,
			startTime: null,
			elapsed: startTime || 0,
		};
	}
	
	async componentDidMount() {
		const callLocation = () => {
			if(Platform.OS === 'ios') {
				this.getLocation();
			} else {
				const requestLocationPermission = async () => {
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
						this.getLocation();
					} else {
						alert('Permissão de Localização negada');
					}
				};
				requestLocationPermission();
			}
		}
		
		callLocation()
		
		// if (granted === PermissionsAndroid.RESULTS.GRANTED) {
		//     Geolocation.getCurrentPosition(
		//         ({coords: {latitude, longitude}}) => {
		//             this.setState({
		//                 latitude,
		//                 longitude,
		//             })
		//         }
		//     )
		// } else {
		//     console.log("Erro ao buscar localização");
		// }
		
		
	}
	
	async componentWillUnmount() {
		Geolocation.clearWatch(this.watchID);
		
		await ReactNativeForegroundService.remove_all_tasks()
		await ReactNativeForegroundService.stop()
	}
	
	getLocation = () => {
		Geolocation.getCurrentPosition(
			(position) => {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;
				
				this.setState({latitude, longitude})
			},
			(error) => alert(error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		)
	};
	
	getMapRegion = () => ({
		latitude: this.state.latitude,
		longitude: this.state.longitude,
		latitudeDelta: LATITUDE_DELTA,
		longitudeDelta: LONGITUDE_DELTA
	});
	
	calcDistance = newLatLng => {
		const { prevLatLng } = this.state;
		return haversine(prevLatLng, newLatLng) || 0;
	};
	
	handleTimer = async () => {
		const {timer} = this.state
		if(timer === null){
			this.watchID = Geolocation.watchPosition(
				({coords: {latitude, longitude}}) => {
					const {coordinate} = this.state
					const newCoordinate = {latitude, longitude}
					const { routeCoordinates, distanceTravelled } = this.state;
					
					if(Platform.OS === "android"){
						if(this.marker){
							this.marker.animateMarkerToCoordinate(
								newCoordinate,
								500
							)
						}
					}else{
						coordinate.timing(newCoordinate).start();
					}
					
					ReactNativeForegroundService.update({
						id: 144,
						title: "Current Position",
						message: `${newCoordinate.latitude} ${newCoordinate.longitude}`,
						vibration: false
					})
					
					this.setState({
						latitude,
						longitude,
						routeCoordinates: routeCoordinates.concat([newCoordinate]),
						distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
						prevLatLng: newCoordinate
					});
				},
				error => console.log(error),
				{
					enableHighAccuracy: true,
					timeout: 500,
					maximumAge: 10000,
					distanceFilter: 1
				})
			
			// ReactNativeForegroundService.add_task(() => {
			//     Toast.show({
			//         text1: 'Service is running',
			//         text2: 'Service running in background',
			//         visibilityTime: 5000
			//     })
			//
			//
			// }, {
			//     // delay: 1000,
			//     onLoop: false,
			//     taskId: "taskid",
			//     onError: (e) => console.log(`Error logging:`, e),
			// });
			//
			// await ReactNativeForegroundService.start({
			//     id: 144,
			//     title: "Current Position",
			//     message: `Location in here`,
			//     vibration: false,
			//     importance: 1
			// });
			
			this.setState({startTime: this.state.elapsed ? new Date() - this.state.elapsed : new Date(), isRunning: true});
			this.interval = this.interval ? this.interval : setInterval(() => {
				this.setState({elapsed: new Date() - this.state.startTime });
			}, 100);
			
			// this.state.timer = setInterval(() => {
			// 	// let minute = parseInt(this.state.number) === 59 ? this.state.minute + 1 : this.state.minute
			// 	// let number = parseFloat(this.state.number) < 59 ? this.state.number += 1 : 0
			// 	// let fmtMin = minute < 10 ? '0'+minute.toString() : minute.toString()
			// 	// let fmtSec = number < 10 ? '0'+number.toString() : number.toString()
			// 	// let fmtTimer = fmtMin+':'+fmtSec
			// 	// var totalMinutes = minute + number / 60,
			// 	// 	pace = totalMinutes / this.state.distanceTravelled,
			// 	// 	paceMinutes = Math.floor(pace),
			// 	// 	paceSeconds = Math.round((pace - paceMinutes) * 60);
			// 	// if(paceSeconds < 10) {
			// 	// 	paceSeconds = "0" + paceSeconds;
			// 	// }
			// 	// let fmtPace = paceMinutes + ":" + paceSeconds
			// 	// this.setState({
			// 	// 	fmtPace,
			// 	// 	isRunning: true
			// 	// })
			// }, 1000)
		}else{
			this.watchID = Geolocation.stopObserving()
			clearInterval(this.state.timer)
			this.setState({
				timer: null,
				isRunning: false,
				prevLatLng: {},
				routeCoordinates: [],
				distanceTravelled: this.state.distanceTravelled + this.calcDistance({latitude: this.state.latitude, longitude: this.state.longitude}),
			})
		}
	}
	
	formatTime() {
		const now = this.state.elapsed;
		const value = formatTimeString(now, null);
		console.log(value)
		return value
	}
	
	formatPace() {
		const now = this.state.elapsed;
		let time = this.state.elapsed;
		let seconds = Math.floor(now / 1000);
		let minutes = Math.floor(now / 60000);
		let hours = Math.floor(now / 3600000);
		var totalMinutes = hours * 60 + minutes + seconds / 60,
			pace = totalMinutes / this.state.distanceTravelled,
			paceMinutes = Math.floor(pace),
			paceSeconds = Math.round((pace - paceMinutes) * 60);
		if(paceSeconds < 10) {
			paceSeconds = "0" + paceSeconds;
		}
		let fmtPace = this.state.distanceTravelled > 0 ? paceMinutes + ":" + paceSeconds : '0.00'
		return fmtPace;
	}
	
	clearTime = () => {
		this.watchID = Geolocation.stopObserving()
		clearInterval(this.state.timer)
		this.setState({
			timer: null,
			isRunning: false,
			minute: 0,
			number: 0,
			fmtTimer: '00:00',
			fmtPace: '00:00',
			prevLatLng: {},
			routeCoordinates: [],
			distanceTravelled: 0,
		})
	}
	
	render() {
		const {isRunning} = this.state
		
		return (
			<View style={styles.container}>
				<MapView
					style={styles.map}
					provider={PROVIDER_GOOGLE}
					showUserLocation
					followUserLocation
					loadingEnabled
					region={this.getMapRegion()}
				>
					<Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
					<Marker.Animated
						ref={marker => {
							this.marker = marker;
						}}
						coordinate={this.state.coordinate}
					/>
				</MapView>
				
				<View>
					{/*
					<Stopwatch laps msecs start={this.state.stopwatchStart}
					reset={this.state.stopwatchReset}
					options={options}
					getTime={this.getFormattedTime} />
				
					<TouchableOpacity onPress={this.toggleStopwatch}>
						<Text style={{fontSize: 30}}>{!this.state.stopwatchStart ? "Start" : "Stop"}</Text>
					</TouchableOpacity>
				*/}
				</View>
				<View style={styles.buttonContainer}>
					<View style={[styles.bubble, styles.button]}>
						<Text style={styles.bottomBarContent}>
							Distância: {parseFloat(this.state.distanceTravelled).toFixed(2)} km
						</Text>
					</View>
					<View style={[styles.bubble, styles.button, {justifyContent: 'center'}]}>
						{/*<Text> Tempo Gasto </Text>*/}
						{/*<Text>Tempo: {`${this.state.minute}:${this.state.number}`} </Text>*/}
						<Text>Tempo: {this.formatTime()} </Text>
					</View>
				</View>
				
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[styles.buttonStart, {backgroundColor: !isRunning ? "#65ed53": "#eb1915"}]}
						onPress={() => this.handleTimer()}
					>
						<Text>
							{!isRunning ? "Start" : "Stop"}
						</Text>
					</TouchableOpacity>
					
					<View style={[styles.bubble, styles.button, {justifyContent: 'center'}]}>
						{/*<Text> Tempo Gasto </Text>*/}
						{/*<Text>Tempo: {`${this.state.minute}:${this.state.number}`} </Text>*/}
						<Text>Ritmo: {this.formatPace()} min/km</Text>
					</View>
					
					{this.state.isRunning &&
					<TouchableOpacity
						style={[styles.buttonStart, {backgroundColor: "#65ed53"}]}
						onPress={() => this.clearTime()}
					>
						<Text>
							{"Pause"}
						</Text>
					</TouchableOpacity>
					}
				</View>
				<Toast />
			</View>
		);
	}
}

const options = {
	container: {
		backgroundColor: '#000',
		padding: 5,
		borderRadius: 5,
		width: 220,
	},
	text: {
		fontSize: 30,
		color: '#FFF',
		marginLeft: 7,
	}
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "flex-end",
		alignItems: "center"
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	bubble: {
		flex: 1,
		backgroundColor: "rgba(255,255,255,0.7)",
		paddingHorizontal: 18,
		paddingVertical: 12,
		borderRadius: 20
	},
	latlng: {
		width: 200,
		alignItems: "stretch"
	},
	button: {
		width: 80,
		paddingHorizontal: 12,
		alignItems: "center",
		marginHorizontal: 10
	},
	buttonContainer: {
		flexDirection: "row",
		marginVertical: 10,
		backgroundColor: "transparent"
	},
	buttonStart: {
		height: 60,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 10,
		// flex: 1,
		paddingHorizontal: 18,
		// paddingVertical: 12,
		borderRadius: 50
	},
});

export default AnimatedMarkers;