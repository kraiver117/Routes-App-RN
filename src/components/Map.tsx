import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {Loading} from '../pages/Loading';
import {Fab} from './Fab';

interface Props {
  markers?: Marker[];
}

export const Map = ({}: Props) => {
  const [showPolyline, setshowPolyline] = useState(true);

  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowingUserLocation,
    routeLines,
  } = useLocation();

  useEffect(() => {
    followUserLocation();
    return () => {
      stopFollowingUserLocation(); // cleaning the useEffect
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UseEffect to track the user current position
  useEffect(() => {
    if (!following.current) {
      return;
    }

    const {latitude, longitude} = userLocation;

    mapViewRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    });
  }, [userLocation]);

  // Create a component reference to use its methods
  const mapViewRef = useRef<MapView>();
  const following = useRef<Boolean>(true);

  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();

    following.current = true;

    // Now with the reference we have access to MapView methods
    mapViewRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    });
  };

  if (!hasLocation) {
    console.log(hasLocation);
    return <Loading />;
  }

  return (
    <>
      <MapView
        ref={el => (mapViewRef.current = el!)}
        style={style.container}
        showsUserLocation
        initialRegion={{
          latitude: initialPosition!.latitude,
          longitude: initialPosition!.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onTouchStart={() => (following.current = false)}>
        {showPolyline && (
          <Polyline
            coordinates={routeLines}
            strokeColor="black"
            strokeWidth={3}
          />
        )}
      </MapView>
      <Fab
        iconName="compass-outline"
        onPress={centerPosition}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{position: 'absolute', bottom: 20, right: 20}}
      />
      <Fab
        iconName="brush-outline"
        onPress={() => setshowPolyline(!showPolyline)}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{position: 'absolute', bottom: 80, right: 20}}
      />
    </>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
