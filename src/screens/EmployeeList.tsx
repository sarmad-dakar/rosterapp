import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { AppNavigatorScreenParams } from '../navigation/AuthNavigator';
import { RootState } from '../redux/store';
import { Employee } from './EmployeeScreen';

const IS_IOS_18_PLUS =
  Platform.OS === 'ios' && parseInt(Platform.Version, 10) > 18;

const EmployeeList: React.FC<AppNavigatorScreenParams<'customerList'>> = ({
  navigation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const searchInputRef = useRef<TextInput>(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const employeData = useSelector((state: RootState) => state?.auth?.employees);

  const filteredEmployees = employeData.filter((emp: Employee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.code.toLowerCase().includes(searchLower) ||
      emp.idCard.toLowerCase().includes(searchLower) ||
      emp.name.toLowerCase().includes(searchLower) ||
      emp.surName.toLowerCase().includes(searchLower)
    );
  });
  const renderSearchIcon = useCallback(
    () =>
      !IS_IOS_18_PLUS && !searchVisible ? (
        <TouchableOpacity
          style={styles.headerSearchButton}
          onPress={handleSearchPress}
        >
          <Text style={styles.headerSearchIcon}>
            <Icon name="search-outline" />
          </Text>
        </TouchableOpacity>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchVisible],
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Employees',
      headerRight: renderSearchIcon,
    });
  }, [navigation, searchVisible, renderSearchIcon]);

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

  const renderEmployeeCard = ({ item }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => handleEdit(item.code)}
    >
      <View style={styles.cardContent}>
        <View style={[styles.avatar, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.avatarText}>
            {getInitials(item.name, item.surName)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.employeeName}>
              {item.name} {item.surName}
            </Text>
            <View
              style={[
                styles.statusDot,
                item.current === 'Yes' ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          </View>

          <View style={styles.detailsRowDouble}>
            <View style={[styles.detailsRowHalf]}>
              <Text style={styles.detailLabel}>Code: </Text>
              <Text style={styles.detailValue}>{item.code}</Text>
            </View>
            <View style={[styles.detailsRowHalf, { justifyContent: 'center' }]}>
              <Text style={styles.detailLabel}>ID: </Text>
              {/*  */}
              <Text style={styles.detailValue}>{item.idCard}</Text>
            </View>
          </View>

          <Text style={styles.detailsFullText}>
            <Text style={[styles.detailLabel]}>DOB: </Text>
            <Text style={styles.detailValue}>
              {formatDate(item.dateOfBirth)} || Age :{item.age}
            </Text>
          </Text>
        </View>

        {/* <View style={styles.editIconContainer}>
          <Text style={styles.editIcon}>✏️</Text>
        </View> */}
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
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  activeDot: {
    backgroundColor: '#10b981',
  },
  inactiveDot: {
    backgroundColor: '#ef4444',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailsRowDouble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 2,
  },
  detailsRowHalf: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailsFullText: {
    fontSize: 13,
    marginTop: 2,
  },
  detailSeparator: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#475569',
  },
  editIconContainer: {
    paddingLeft: 12,
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 18,
  },
  bottomSearchContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(249, 250, 251, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingTop: 12,
    boxShadow: '0 -1px 10px 10px rgba(145, 145, 145, 0.05)',
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
