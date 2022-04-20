import React, {useState, createContext} from 'react';
import {Platform} from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  PermissionStatus,
  request,
} from 'react-native-permissions';

export interface PermissionsState {
  locationStatus: PermissionStatus;
}

export const PermissionInitState: PermissionsState = {
  locationStatus: 'unavailable',
};

type PermissionContextProps = {
  permissions: PermissionsState;
  askLocationPermissions: () => void;
  checkLocationpermissions: () => void;
};

export const PermissionsContext = createContext({} as PermissionContextProps); //TODO: Define the export

export const PermissionsProvider = ({children}: any) => {
  const [permissions, setPermissions] = useState(PermissionInitState);

  const askLocationPermissions = async () => {
    let permissionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      // # Ask for permission requested and show a pop up
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }

    // # Open mobile setting to change permissions
    if (permissionStatus === 'blocked') {
      openSettings();
    }

    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  };

  const checkLocationpermissions = async () => {
    let permissionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      // # Check if the permission is denied or granted
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        askLocationPermissions,
        checkLocationpermissions,
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};
