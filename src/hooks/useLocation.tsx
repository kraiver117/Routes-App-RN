import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

interface Location {
  latitude: number;
  longitude: number;
}

export const useLocation = () => {
  // check is location has been set
  const [hasLocation, setHasLocation] = useState(false);

  //  Trace User route
  const [routeLines, setRouteLines] = useState<Location[]>([]);

  // User initial position
  const [initialPosition, setInitialPosition] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  // User location when is moving
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  // Watch ID to clean watch position listener
  const watchId = useRef<number>();

  // * It is neccesary to check if the component is still mounted
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // As soon as this custom hook is called, it gets the user initial position
  useEffect(() => {
    getCurrentLocation().then(location => {
      // * If hook is not mounted return nothing.
      if (!isMounted) {
        return;
      }

      setInitialPosition(location);
      setRouteLines(routes => [...routes, location]);
      setUserLocation(location);
      setHasLocation(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          setHasLocation(true);

          console.log(coords);
        } /**OK*/,
        err => reject({err}) /**error*/,
        {
          enableHighAccuracy: true,
        },
      );
    });
  };

  const followUserLocation = () => {
    watchId.current = Geolocation.watchPosition(
      ({coords}) => {
        // * If component is not mounted return nothing;
        if (!isMounted) {
          return;
        }

        const location: Location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        setUserLocation(location);

        setRouteLines(routes => [...routes, location]);
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  };

  const stopFollowingUserLocation = () => {
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }
  };

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    stopFollowingUserLocation,
    userLocation,
    routeLines,
  };
};
