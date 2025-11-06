import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  label: string;
  value: string | any[];
  onPress: () => void;
  displayKey?: string;
}

const DropdownTrigger: React.FC<Props> = ({
  label,
  value,
  onPress,
  displayKey = 'name',
}) => {
  const isArray = Array.isArray(value);
  const hasValue = isArray ? value.length > 0 : !!value;
  const isEmpty = isArray ? value.length === 0 : !value;

  const getDisplayText = (item: any) => {
    if (typeof item === 'string') {
      return item;
    }
    return (
      item.code ||
      item[displayKey] ||
      item.description ||
      item.title ||
      String(item)
    );
  };

  const renderValue = () => {
    if (isEmpty) {
      return `Select ${label.toLowerCase()}`;
    }

    if (isArray) {
      const displayTexts = value.map(getDisplayText);

      if (value.length === 1) {
        return displayTexts[0];
      } else if (value.length <= 3) {
        return displayTexts.join(', ');
      } else {
        return `${displayTexts.slice(0, 2).join(', ')} +${
          value.length - 2
        } more`;
      }
    }

    return getDisplayText(value);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        hasValue && styles.containerActive,
        pressed && styles.pressed,
      ]}
      android_ripple={{ color: '#f1f5f9', borderless: false }}
    >
      {hasValue && (
        <LinearGradient
          colors={['#0d4483', '#1a5da8', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeIndicator}
        />
      )}
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[styles.iconCircle, hasValue && styles.iconCircleActive]}
          >
            <Icon
              name={
                label === 'Company'
                  ? 'business'
                  : label === 'Roster Grouping'
                  ? 'group-work'
                  : 'person'
              }
              size={20}
              color={hasValue ? '#0d4483' : '#94a3b8'}
            />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{label}</Text>
              {isArray && value.length > 0 && (
                <View style={styles.countBadge}>
                  <LinearGradient
                    colors={['#0d4483', '#1a5da8', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.badgeGradient}
                  >
                    <Text style={styles.countText}>{value.length}</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
            <Text
              style={[styles.value, isEmpty && styles.placeholder]}
              numberOfLines={1}
            >
              {renderValue()}
            </Text>
          </View>
        </View>
        <View
          style={[styles.chevronContainer, hasValue && styles.chevronActive]}
        >
          <Icon
            name="keyboard-arrow-down"
            size={24}
            color={hasValue ? '#0d4483' : '#94a3b8'}
          />
        </View>
      </View>
    </Pressable>
  );
};
export default DropdownTrigger;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  containerActive: {
    borderColor: '#c7d2fe',
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pressed: {
    backgroundColor: '#f8fafc',
    transform: [{ scale: 0.98 }],
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 12,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleActive: {
    backgroundColor: '#eef2ff',
  },
  textContainer: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  countBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 20,
  },
  placeholder: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  chevronContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  chevronActive: {
    backgroundColor: '#eef2ff',
  },
});
