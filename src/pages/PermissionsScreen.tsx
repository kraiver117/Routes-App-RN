import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import {BlackButton} from '../components/BlackButton';
import {PermissionsContext} from '../context/PermissionsContext';

export const PermissionsScreen = () => {
  const {permissions, askLocationPermissions, checkLocationpermissions} =
    useContext(PermissionsContext);

  useEffect(() => {
    checkLocationpermissions();

    // #Check the state of the app if is in background, active, inactive, etc.
    AppState.addEventListener('change', state => {
      if (state !== 'active') {
        return;
      }

      checkLocationpermissions();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        To use this application is neccesary to use GPS
      </Text>
      <BlackButton title="Access to GPS" onPress={askLocationPermissions} />
      <Text>{JSON.stringify(permissions, null, 5)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 200,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
