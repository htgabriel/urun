import React from "react";
import {StyleSheet} from "react-native"
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from "react-native-maps";

export default function ActivitiesMap({location, pin, setMarker, coordinatesTravelled}) {
	return (
		<MapView
			style={styles.map}
			provider={PROVIDER_GOOGLE}
			showUserLocation
			followUserLocation
			loadingEnabled
			region={location}
		>
			<Polyline coordinates={coordinatesTravelled} strokeWidth={4}/>
			<Marker.Animated
				ref={marker => setMarker && setMarker(marker)}
				coordinate={pin}
			/>
		</MapView>
	)
};

const styles = StyleSheet.create({
	map: {
		flex: 2
	}
})