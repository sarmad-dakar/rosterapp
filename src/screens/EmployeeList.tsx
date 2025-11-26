import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const IS_IOS_18_PLUS =
  Platform.OS === 'ios' && parseInt(Platform.Version, 10) > 18;

const EmployeeList = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const searchInputRef = useRef(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const employeData = useSelector(state => state?.auth?.employees);

  const filteredEmployees = employeData.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.code.toLowerCase().includes(searchLower) ||
      emp.idCard.toLowerCase().includes(searchLower) ||
      emp.name.toLowerCase().includes(searchLower) ||
      emp.surName.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    // Set header title
    navigation.setOptions({
      headerTitle: 'Employees',
      headerRight: () =>
        !IS_IOS_18_PLUS && !searchVisible ? (
          <TouchableOpacity
            style={styles.headerSearchButton}
            onPress={handleSearchPress}
          >
            <Text style={styles.headerSearchIcon}>🔍</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, searchVisible]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => setKeyboardHeight(e.endCoordinates.height),
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0),
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSearchPress = () => {
    if (!IS_IOS_18_PLUS) {
      setSearchVisible(true);
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        searchInputRef.current?.focus();
      });
    }
  };

  const handleSearchClose = () => {
    if (!IS_IOS_18_PLUS) {
      Keyboard.dismiss();
      setSearchTerm('');
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSearchVisible(false);
      });
    }
  };

  const handleEdit = (code: string) => {
    navigation.navigate('rosterTransactionView', {
      employeeCode: code,
      title: 'Employee Career',
    });
  };

  const getInitials = (name: string, surName: string) => {
    return `${name.charAt(0)}${surName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
    ];
    return colors[index % colors.length];
  };

  const renderEmployeeCard = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.6}
      onPress={() => handleEdit(item.code)}
    >
      <View style={styles.cardHeader}>
        <View
          style={[styles.avatar, { backgroundColor: getAvatarColor(index) }]}
        >
          <Text style={styles.avatarText}>
            {getInitials(item.name, item.surName)}
          </Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.employeeName} numberOfLines={1}>
            {item.name} {item.surName}
          </Text>
          <Text style={styles.employeeCode}>#{item.code}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            item.current === 'Yes' ? styles.activeBadge : styles.inactiveBadge,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              item.current === 'Yes' ? styles.activeDot : styles.inactiveDot,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              item.current === 'Yes' ? styles.activeText : styles.inactiveText,
            ]}
          >
            {item.current === 'Yes' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ID Card</Text>
            <Text style={styles.infoValue}>{item.idCard}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{item.age} years</Text>
          </View>
        </View>

        <View style={styles.infoRowSingle}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>{formatDate(item.dateOfBirth)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () =>
    !IS_IOS_18_PLUS && searchVisible ? (
      <View style={styles.headerSearchContainer}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search by name, code or ID..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#94a3b8"
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearchClose}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;

  const renderBottomSearch = () => (
    <Animated.View
      style={[
        styles.bottomSearchContainer,
        {
          paddingBottom: keyboardHeight > 0 ? 12 : Math.max(insets.bottom, 12),
          bottom: keyboardHeight,
        },
      ]}
    >
      <View style={styles.bottomSearchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#94a3b8"
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {renderHeader()}

      {filteredEmployees.length > 0 ? (
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeCard}
          keyExtractor={item => item.code}
          contentContainerStyle={[
            styles.listContent,
            IS_IOS_18_PLUS && { paddingBottom: 120 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>No employees found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search criteria
          </Text>
        </View>
      )}

      {IS_IOS_18_PLUS && renderBottomSearch()}
    </View>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerSearchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerSearchIcon: {
    fontSize: 18,
  },
  headerSearchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    padding: 0,
  },
  clearIcon: {
    fontSize: 18,
    color: '#94a3b8',
    paddingHorizontal: 8,
  },
  listContent: {
    padding: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  employeeName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  employeeCode: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  inactiveBadge: {
    backgroundColor: '#fee2e2',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#16a34a',
  },
  inactiveDot: {
    backgroundColor: '#dc2626',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#16a34a',
  },
  inactiveText: {
    color: '#dc2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoRowSingle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },
  bottomSearchContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 250, 251, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  bottomSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
  },
});
