import { Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

const CheckboxComponent = ({ label }) => {
  const [checked, setChecked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  const onChange = (newValue: boolean) => {
    setChecked(newValue);
    // Scale animation for press feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Check mark animation
    Animated.spring(checkAnim, {
      toValue: checked ? 1 : 0,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const checkRotate = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <Pressable
      style={styles.container}
      onPress={() => onChange(!checked)}
      hitSlop={12}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View
          style={[
            styles.checkboxBase,
            {
              backgroundColor: checked ? '#6366f1' : '#f3f4f6',
              borderColor: checked ? '#6366f1' : '#d1d5db',
            },
          ]}
        >
          {checked && (
            <Animated.View
              style={[
                styles.checkmark,
                {
                  transform: [{ scale: checkScale }, { rotate: checkRotate }],
                },
              ]}
            >
              <View style={styles.checkmarkStem} />
              <View style={styles.checkmarkKick} />
            </Animated.View>
          )}
        </View>
      </Animated.View>
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
};

export default CheckboxComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkmark: {
    width: 14,
    height: 14,
    position: 'relative',
  },
  checkmarkStem: {
    position: 'absolute',
    width: 2.5,
    height: 10,
    backgroundColor: '#fff',
    left: 8,
    top: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1.5,
  },
  checkmarkKick: {
    position: 'absolute',
    width: 2.5,
    height: 5,
    backgroundColor: '#fff',
    left: 3,
    top: 7,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1.5,
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    letterSpacing: 0.2,
  },
});
