import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import PagerTabs from '../components/PagerTabs';

const ComponentName = () => {
  const styles = MyStyles();
  return (
    <View style={styles.container}>
      <PagerTabs />

      {/* <InputField label="Username" placeholder="Enter your username" /> */}
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
