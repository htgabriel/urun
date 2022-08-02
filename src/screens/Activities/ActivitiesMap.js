import React, {useState} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native"
import MapView, {AnimatedRegion, Marker, Polyline, PROVIDER_GOOGLE} from "react-native-maps";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 0;
const LONGITUDE = 0;
const {height}= Dimensions.get("screen");
const {width} = Dimensions.get("screen");

export default function ActivitiesMap() {
	const [mapReady, setMapReady] = useState(false)
	const [location, setLocation] = useState({
		latitude: LATITUDE,
		longitude: LONGITUDE
	})
	const [routeCoordinates, setRouteCoordinates] = useState([])
	const [coordinate, setCoordinate] = useState(new AnimatedRegion({
		latitude: LATITUDE,
		longitude: LONGITUDE,
		latitudeDelta: 0,
		longitudeDelta: 0
	}))
	
	console.log(mapReady)
	return (
		<>
			<MapView
				style={{
					flex: 1,
					minHeight: 500 * 0.8,
				}}
				provider={PROVIDER_GOOGLE}
				showUserLocation
				followUserLocation
				loadingEnabled
				onMapReady={() => setMapReady(true)}
				region={{
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: LATITUDE_DELTA,
					longitudeDelta: LONGITUDE_DELTA
				}}
			>
				{mapReady ?
					<>
						<Polyline coordinates={routeCoordinates} strokeWidth={5}/>
						<Marker.Animated
							ref={marker => {
								// this.marker = marker;
							}}
							coordinate={coordinate}
						/>
					</> : null
				}
			</MapView>
			
			<View style={styles.timer}>
				<Text>{"TESTEEEEE"}</Text>
			</View>
		</>
	)
};

const styles = StyleSheet.create({
	map: {
		...StyleSheet.absoluteFillObject,
		height: height*0.8
	},
	timer: {
		borderTopWidth: 3,
		borderTopColor: "#e3e3e3"
	}
})