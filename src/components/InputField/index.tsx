import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { styles } from './styles';

type Props = {
  reference?: React.RefObject<TextInput>;
  label?: string;
  icon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  error?: string;
  inputStyle?: StyleProp<ViewStyle> | undefined;
  style?: StyleProp<ViewStyle> | undefined;
} & TextInputProps;

const InputField: FC<Props> = props => {
  const [showPassword, setShowPassword] = useState(
    props.secureTextEntry || false,
  );
  const inputRef = useRef<TextInput>(null);
  const borderAnimation = useRef(new Animated.Value(0)).current;
  const [height, setHeight] = useState(Dimensions.get('window').height);

  const [inputValue, setInputValue] = useState(props.value || '');

  useEffect(() => {
    setInputValue(props.value || '');
  }, [props.value]);

  const displayError = props.error;

  const handleOrientationChange = () => {
    const { height: newHeight } = Dimensions.get('window');
    setHeight(newHeight);
  };

  useEffect(() => {
    const unSub = Dimensions.addEventListener(
      'change',
      handleOrientationChange,
    );
    return () => {
      unSub.remove();
    };
  }, []);

  const tintColorAnimation = () => {
    Animated.timing(borderAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const tintOut = () => {
    Animated.timing(borderAnimation, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (props?.onBlur) {
      props.onBlur(e);
    }
    tintOut();
  };

  const handleInputPress = () => {
    if (props.reference) {
      props.reference.current?.focus();
    } else if (props.onPress) {
      props.onPress();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    props.onChangeText?.(text);
  };

  return (
    <View>
      {props.label && (
        <Text style={[styles.label, displayError && { color: 'red' }]}>
          {props.label}
        </Text>
      )}

      <Animated.View
        style={[
          styles.container,
          {
            borderColor: borderAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['#979797ff', '#2563EB'],
            }),
          },
          displayError && { borderColor: 'red' },
          height < 420 && styles.smallContainer,
          props.style,
          props.inputStyle,
        ]}
      >
        <Pressable onPress={handleInputPress} style={styles.textContainer}>
          <View
            style={styles.textContainer}
            pointerEvents={handleInputPress ? 'none' : 'auto'}
          >
            {props.icon && (
              <View style={styles.iconContainer}>
                <Image
                  source={props.icon}
                  style={[
                    styles.rightIcon,
                    displayError && { tintColor: 'red' },
                  ]}
                />
              </View>
            )}
            <TextInput
              onFocus={tintColorAnimation}
              onBlur={handleBlur}
              ref={props.reference ?? inputRef}
              style={styles.input}
              placeholderTextColor={displayError ? 'red' : '#696969ff'}
              // allowFontScaling={false}
              value={inputValue}
              onChangeText={handleChangeText}
              secureTextEntry={showPassword}
              editable={!(props.editable === false)}
              {...props}
            />
          </View>
          {props.rightIcon && (
            <View style={styles.rightContainer}>
              <Image
                source={props.rightIcon}
                style={[styles.rightIcon, displayError && { tintColor: 'red' }]}
              />
            </View>
          )}
        </Pressable>
      </Animated.View>

      {displayError && <Text style={styles.error}>{displayError}</Text>}
    </View>
  );
};

export default InputField;
