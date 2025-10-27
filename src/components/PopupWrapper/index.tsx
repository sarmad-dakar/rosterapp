import React, {
  forwardRef,
  JSX,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { vh, vw } from '../../utils/units';
const { height } = Dimensions.get('window');

export type PopupWrapperRef = {
  show: () => void;
  hide: () => void;
};

type PopupWrapperProps = {
  reference?: RefObject<PopupWrapperRef>; // Optional if passing forwardRef
  cancel?: boolean;
  children: JSX.Element;
  title?: string;
  maxHeight?: number;
};

const PopupWrapper = forwardRef<PopupWrapperRef, PopupWrapperProps>(
  (props, ref) => {
    const translateY = useRef(new Animated.Value(height)).current; // Initial position (off-screen)
    const backdropOpacity = useRef(new Animated.Value(0)).current; // Initial backdrop opacity
    const [visible, setVisible] = useState(false);
    const styles = MyStyles();

    useImperativeHandle(ref || props.reference, () => ({
      hide: hide,
      show: show,
    }));

    const hide = () => {
      slideDown();
    };

    const show = () => {
      setVisible(true);
    };

    useEffect(() => {
      if (visible) {
        slideUp();
      }
    }, [visible]);

    // Slide-up animation with backdrop fade-in
    const slideUp = () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Slide-down animation with backdrop fade-out
    const slideDown = () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    };

    return (
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={hide}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={hide}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.bottomSheet,
            { transform: [{ translateY }] }, // Animated slide-up
          ]}
        >
          <TouchableOpacity style={styles.crossIcon} onPress={hide}>
            <Icon name="close" size={24} color={'#0007'} />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 0 }}
            style={styles.content}
          >
            {props.children}
          </ScrollView>
        </Animated.View>
      </Modal>
    );
  },
);

export default PopupWrapper;

const MyStyles = () => {
  const styles = StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    backdropTouchable: {
      flex: 1,
    },
    bottomSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: vw > 6 ? 30 : 10,
      maxHeight: vh * 80,
      // paddingTop: 10,
    },
    content: {
      flex: 1,
      paddingTop: 10,
      padding: vw > 6 ? 30 : 10,
    },
    rowDirection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: vw > 6 ? 30 : 10,
    },
    crossIcon: {
      position: 'absolute',
      top: vw > 6 ? 30 : 20,
      right: vw > 6 ? 30 : 20,
    },
  });
  return styles;
};
