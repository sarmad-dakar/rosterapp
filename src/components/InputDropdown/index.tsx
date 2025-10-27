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
import DropdownList from './DropwdownList'; // Import the new component

interface DropdownItem {
  description: string;
  otherLanguage?: string;
  internalCode?: string;
  [key: string]: any;
}

type Props = {
  reference?: React.RefObject<TextInput>;
  label?: string;
  icon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  error?: string;
  inputStyle?: StyleProp<ViewStyle> | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  dropdown: boolean;
  ismodal?: boolean;
  dropdownData?: DropdownItem[]; // Add dropdown data prop
  onDropdownSelect?: (item: DropdownItem) => void; // Add selection handler
  dropdownTitle?: string; // Optional title for dropdown
  dropdownDisplayKey?: string; // Key to display from dropdown items
} & TextInputProps;

const InputDropdown: FC<Props> = props => {
  const [showPassword, setShowPassword] = useState(
    props.secureTextEntry || false,
  );
  const inputRef = useRef<TextInput>(null);
  const borderAnimation = useRef(new Animated.Value(0)).current;
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const [inputValue, setInputValue] = useState(props.value || '');
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
    if (props.dropdown && !props.ismodal && props.dropdownData) {
      // Open dropdown list for non-modal dropdown
      setDropdownVisible(true);
    } else if (props.reference) {
      props.reference.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    props.onChangeText?.(text);
  };

  const handleDropdownSelect = (item: DropdownItem) => {
    const displayKey = props.dropdownDisplayKey || 'description';
    const selectedValue = item[displayKey] || item.description || '';

    setInputValue(selectedValue);

    if (props.onChangeText) {
      props.onChangeText(selectedValue);
    }

    if (props.onDropdownSelect) {
      props.onDropdownSelect(item);
    }

    setDropdownVisible(false);
  };

  const handleModalPress = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  const handleDropdownPress = () => {
    console.log(props.dropdownData, 'Dropdown pressed');
    if (props.dropdownData) {
      setDropdownVisible(true);
    }
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

          <Text
            style={{ color: '#444444ff', fontSize: vh * 1.32 }}
            numberOfLines={1}
          >
            {props.value || props.placeholder}
          </Text>
        </Pressable>

        {props.ismodal ? (
          <TouchableOpacity
            onPress={handleModalPress}
            style={styles.rightContainer}
          >
            <FontAwesome name="list-alt" color="#444444ff" size={18} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleDropdownPress}
            style={styles.rightContainer}
          >
            <FontAwesome name="angle-down" color="#444444ff" size={18} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {displayError && <Text style={styles.error}>{displayError}</Text>}

      {/* Dropdown List Modal */}
      {!props.ismodal && props.dropdownData && (
        <DropdownList
          visible={dropdownVisible}
          onClose={() => setDropdownVisible(false)}
          data={props.dropdownData}
          onSelect={handleDropdownSelect}
          title={props.dropdownTitle || props.label || 'Select an option'}
          displayKey={props.dropdownDisplayKey}
        />
      )}
    </View>
  );
};

export default InputDropdown;
