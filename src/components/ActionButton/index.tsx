import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';

const ActionButton: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.actionButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={colors.themeGradiant}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 1,
        y: 1,
      }}
      style={styles.actionButtonGradient}
    />
    <View style={styles.iconCircle}>
      <Icon name={icon} style={styles.iconText} />
    </View>
    <View style={styles.actionButtonContent}>
      <Text style={styles.actionButtonLabel}>{label}</Text>
      <Icon name={'chevron-forward'} style={styles.arrow} />
    </View>
  </TouchableOpacity>
);
export default ActionButton;

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 6px 4px rgba(0, 0, 0, 0.1)',
  },
  actionButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    // opacity: 0.1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 0px 6px 4px rgba(255, 255, 255, 0.1)',
  },
  iconText: {
    fontSize: 28,
    color: colors.primary,
  },
  actionButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    textAlign: 'center',
  },
  arrow: {
    fontSize: 16,
    color: colors.secondary,
    marginLeft: -4,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
