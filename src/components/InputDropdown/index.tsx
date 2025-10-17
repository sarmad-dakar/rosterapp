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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { vh } from '../../utils/units';

type Props = {
  reference?: React.RefObject<TextInput>;
  label?: string;
  icon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  error?: string;
  inputStyle?: StyleProp<ViewStyle> | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  dropdown: boolean;
} & TextInputProps;

const InputDropdown: FC<Props> = props => {
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
          {props.icon && (
            <View style={styles.iconContainer}>
              <Image
                source={props.icon}
                style={[styles.rightIcon, displayError && { tintColor: 'red' }]}
              />
            </View>
          )}

          <Text style={{ color: '#444444ff', fontSize: vh * 1.32 }}>
            {props.value || props.placeholder}
          </Text>
        </Pressable>

        <View style={styles.rightContainer}>
          <FontAwesome name="list-alt" color="#444444ff" size={18} />
        </View>
      </Animated.View>

      {displayError && <Text style={styles.error}>{displayError}</Text>}
    </View>
  );
};

export default InputDropdown;
