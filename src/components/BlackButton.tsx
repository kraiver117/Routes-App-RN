import React from 'react';
import {StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface Props {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const BlackButton = ({title, onPress, style = {}}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        ...(style as any),
        ...styles.blackButton,
      }}>
      <Text style={{...styles.text}}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    height: 50,
    width: 200,
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    //Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    // Shadow for Android
    elevation: 6,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
