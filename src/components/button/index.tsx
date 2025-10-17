import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const MyCustomButton = ({ buttonText }) => {
  return (
    <View style={styles.testContainer}>
      <Text>{buttonText}</Text>
    </View>
  );
};

export default MyCustomButton;

const styles = StyleSheet.create({
  testContainer: {
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 4,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
