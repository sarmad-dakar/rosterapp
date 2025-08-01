import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  label: string;
  value: string | any[];
  onPress: () => void;
  displayKey?: string; // Key to extract from objects for display
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
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      android_ripple={{ color: '#e2e8f0', borderless: false }}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{label}</Text>
            {isArray && value.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{value.length}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.value, isEmpty && styles.placeholder]}>
            {renderValue()}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name="keyboard-arrow-down"
            size={24}
            color={hasValue ? '#3b82f6' : '#94a3b8'}
          />
        </View>
      </View>
      {hasValue && <View style={styles.selectedIndicator} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    overflow: 'hidden',
  },
  pressed: {
    backgroundColor: '#f8fafc',
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  textContainer: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: 20,
  },
  placeholder: {
    color: '#94a3b8',
    fontWeight: '400',
  },
  iconContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#3b82f6',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});

export default DropdownTrigger;
