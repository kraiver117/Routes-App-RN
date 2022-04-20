import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Map} from '../components/Map';

export const MapScreen = () => {
  return (
    <View style={style.container}>
      <Map />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
