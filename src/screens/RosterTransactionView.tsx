import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComponentName = () => {
  const styles = MyStyles();
  return (
    <View style={styles.container}>
      <Text>ComponentName</Text>
    </View>
  );
};

export default ComponentName;

const MyStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return styles;
};
