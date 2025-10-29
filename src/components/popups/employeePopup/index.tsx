/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PopupRefProps } from '../../../../types/popupTypes';

const { height, width } = Dimensions.get('window');

type Company = {
  code: string;
  idCard: string;
  name: string;
  surname: string;
  dob: string;
  age: number;
};

const MOCK_EMPLOYEES: Company[] = [
  {
    code: '0496170M',
    idCard: '0496170M',
    name: 'Claudio',
    surname: 'Mazzelli',
    dob: '28-06-2023',
    age: 2,
  },
  {
    code: '00462086M',
    idCard: '00462086M',
    name: 'Alison',
    surname: 'Valletta',
    dob: '02-10-1986',
    age: 38,
  },
  {
    code: '00103489M',
    idCard: '00103489M',
    name: 'Deborah',
    surname: 'Farrugia',
    dob: '25-02-1989',
    age: 36,
  },
  {
    code: '00131671M',
    idCard: '00131671M',
    name: 'Christabel',
    surname: 'Ellul',
    dob: '05-03-1971',
    age: 54,
  },
  {
    code: '00365267M',
    idCard: '00365267M',
    name: 'Georgina',
    surname: 'Sant',
    dob: '07-09-1967',
    age: 57,
  },
  {
    code: '00363386M',
    idCard: '00363386M',
    name: 'Stephanie',
    surname: 'Spiteri Said',
    dob: '15-07-1986',
    age: 39,
  },
  {
    code: '00100284M',
    idCard: '00100284M',
    name: 'Paula',
    surname: 'Gatt',
    dob: '09-08-1988',
    age: 36,
  },
];

type Props = {
  reference?: RefObject<PopupRefProps>;
  onSelect?: (selectedGroups: Company[]) => void;
};

const RosterGroupPopup = forwardRef<PopupRefProps, Props>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<Company[]>([]);
  const [filteredData, setFilteredData] = useState(props?.data);

  const translateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    setFilteredData(props?.data);
  }, [props.data]);

  useEffect(() => {
    if (searchText === '') {
      setFilteredData(props?.data);
    } else {
      setFilteredData(
        props?.data?.filter(
          item =>
            item.code.toLowerCase().includes(searchText.toLowerCase()) ||
            item.name.toLowerCase().includes(searchText.toLowerCase()),
        ),
      );
    }
  }, [searchText]);

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
    ]).start(() => setVisible(false));
  };

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const handleSelect = () => {
    props.onSelect?.(selectedGroups);
    hide();
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={[styles.headerCell, styles.selectColumn]}>
        <Icon name="check-box-outline-blank" size={18} color="#64748b" />
      </View>
      <View style={[styles.headerCell, styles.codeColumn]}>
        <Text style={styles.headerText}>Code</Text>
      </View>

      <View style={[styles.headerCell, styles.descriptionColumn]}>
        <Text style={styles.headerText}>Name</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: Company; index: number }) => {
    const isSelected = selectedGroups.some(g => g.code === item.code);

    const toggleSelection = () => {
      setSelectedGroups(prev =>
        isSelected ? prev.filter(g => g.code !== item.code) : [...prev, item],
      );
    };

    return (
      <TouchableOpacity
        onPress={toggleSelection}
        style={[
          styles.tableRow,
          isSelected && styles.selectedRow,
          index % 2 === 1 && styles.alternateRow,
        ]}
        activeOpacity={0.7}
      >
        <View style={[styles.cell, styles.selectColumn]}>
          <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
            {isSelected && <Icon name="check" size={14} color="#ffffff" />}
          </View>
        </View>

        <View style={[styles.cell, styles.codeColumn]}>
          <Text style={[styles.cellText, styles.codeText]} numberOfLines={1}>
            {item.code}
          </Text>
        </View>

        <View style={[styles.cell, styles.descriptionColumn]}>
          <Text style={styles.cellText} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={48} color="#94a3b8" />
      <Text style={styles.emptyTitle}>No roster groups found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search terms</Text>
    </View>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.6)" barStyle="light-content" />
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={slideDown}
        />
      </Animated.View>

      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        {/* Handle bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Icon name="people" size={24} color="#8b5cf6" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Select Employees</Text>
              <Text style={styles.subtitle}>
                Choose from {props?.data?.length} available groups
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={slideDown}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search"
              size={20}
              color="#94a3b8"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search roster groups..."
              placeholderTextColor="#94a3b8"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearButton}
              >
                <Icon name="close" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results and Selection Info */}
        <View style={styles.infoContainer}>
          {searchText.length > 0 && (
            <Text style={styles.resultsText}>
              {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}{' '}
              found
            </Text>
          )}
          {selectedGroups.length > 0 && (
            <View style={styles.selectedInfo}>
              <Icon name="check-circle" size={16} color="#10b981" />
              <Text style={styles.selectedText}>
                {selectedGroups.length} selected
              </Text>
            </View>
          )}
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          {renderTableHeader()}
          <FlatList
            data={filteredData}
            keyExtractor={item => item.code}
            renderItem={renderItem}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContent}
            style={styles.scrollableList}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={slideDown}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectButton,
              !selectedGroups.length && styles.selectButtonDisabled,
            ]}
            onPress={handleSelect}
            disabled={!selectedGroups.length}
            activeOpacity={0.8}
          >
            <Text style={styles.selectButtonText}>
              Select{' '}
              {selectedGroups.length > 0 ? `(${selectedGroups.length})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
});

export default RosterGroupPopup;

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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.85,
    display: 'flex',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 18,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tableContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectColumn: {
    width: 50,
    alignItems: 'center',
  },
  codeColumn: {
    flex: 2,
  },
  typeColumn: {
    flex: 1.5,
  },
  descriptionColumn: {
    flex: 3,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  alternateRow: {
    backgroundColor: '#fafbfc',
  },
  selectedRow: {
    backgroundColor: '#f0f9ff',
    borderBottomColor: '#3b82f6',
    borderBottomWidth: 2,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
  codeText: {
    fontWeight: '600',
    color: '#1e293b',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  selectButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  selectButtonDisabled: {
    backgroundColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
