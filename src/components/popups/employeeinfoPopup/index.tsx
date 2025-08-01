/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
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
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { PopupRefProps } from '../../../../types/popupTypes';

const { height, width } = Dimensions.get('window');

type Props = {
  reference?: RefObject<PopupRefProps>;
  employeeData?: {
    name?: string;
    id?: string;
    role?: string;
    acnooNumber?: string;
    hasEmail?: boolean;
  };
};

const EmployeeInfoPopup = forwardRef<PopupRefProps, Props>((props, ref) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [visible, setVisible] = useState(false);

  // Default employee data
  const employeeData = props.employeeData || {
    name: 'Georgina Sant',
    id: '0036526M',
    role: 'Senior Health...',
    acnooNumber: 'ACNOO*NUR',
    hasEmail: false,
  };

  useImperativeHandle(ref || props.reference, () => ({
    hide,
    show,
  }));

  useEffect(() => {
    if (visible) {
      slideUp();
    } else {
      slideDown();
    }
  }, [visible]);

  const slideUp = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideDown = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const InfoCard = ({
    iconName,
    iconType = 'MaterialIcons',
    title,
    subtitle,
    color,
    disabled = false,
    onPress,
    isButton = false,
  }) => {
    const IconComponent =
      iconType === 'Feather'
        ? FeatherIcon
        : iconType === 'Ionicons'
        ? IoniconsIcon
        : Icon;

    const CardWrapper = isButton ? TouchableOpacity : View;

    return (
      <CardWrapper
        style={[
          styles.infoCard,
          { borderLeftColor: color },
          disabled && styles.disabledCard,
          isButton && styles.buttonCard,
        ]}
        onPress={isButton ? onPress : undefined}
        activeOpacity={isButton ? 0.7 : 1}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <IconComponent
            name={iconName}
            size={22}
            color={disabled ? '#9CA3AF' : color}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, disabled && { color: '#9CA3AF' }]}>
            {title}
          </Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        {isButton ? (
          <View style={styles.sendButton}>
            <FeatherIcon name="send" size={16} color={color} />
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} disabled={disabled}>
            <FeatherIcon
              name="edit-2"
              size={16}
              color={disabled ? '#D1D5DB' : '#6B7280'}
            />
          </TouchableOpacity>
        )}
      </CardWrapper>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={slideDown}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Handle Bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <IoniconsIcon name="person" size={28} color="#ffffff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.employeeName}>{employeeData.name}</Text>
              <View style={styles.idContainer}>
                <Icon name="badge" size={14} color="#6B7280" />
                <Text style={styles.employeeId}>{employeeData.id}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <FeatherIcon name="more-vertical" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <InfoCard
            iconName="work"
            title={employeeData.role}
            subtitle="Role & Department"
            color="#4F46E5"
          />

          <InfoCard
            iconName="more-time"
            title={employeeData.acnooNumber}
            subtitle="ACNOO Number"
            color="#059669"
          />

          <InfoCard
            iconName="mail"
            iconType="Feather"
            title="Send Employee Email"
            subtitle="Tap to send email invitation"
            color="#10B981"
            isButton={true}
            onPress={() => {
              // Handle email sending logic here
              console.log('Sending email to employee...');
              // You can add your email sending logic here
            }}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeButton} onPress={hide}>
            <FeatherIcon
              name="x"
              size={18}
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
});

export default EmployeeInfoPopup;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    width: '92%',
    bottom: 180,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    minHeight: height * 0.45,
    display: 'flex',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeId: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  disabledCard: {
    opacity: 0.6,
  },
  buttonCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B98120',
    transform: [{ scale: 1 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B98115',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    paddingTop: 8,
  },
  closeButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
