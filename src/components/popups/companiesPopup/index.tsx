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
  description: string;
};

const MOCK_COMPANIES: Company[] = [
  { code: 'FMS', description: 'Foundation for Medical Services at MCH' },
  { code: 'MCH', description: 'Mental Health Services' },
];

type Props = {
  reference?: RefObject<PopupRefProps>;
  onSelect?: (selectedCompanies: Company[]) => void;
  initialSelected?: Company[];
};

const CompaniesPopup = forwardRef<PopupRefProps, Props>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [filteredData, setFilteredData] = useState(props.data);

  const translateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref || props.reference, () => ({
    hide,
    show,
  }));

  useEffect(() => {
    setFilteredData(props?.data);
  }, [props.data]);

  useEffect(() => {
    if (visible) {
      slideUp();
    } else {
      slideDown();
    }
  }, [visible]);

  useEffect(() => {
    if (searchText === '') {
      setFilteredData(props?.data);
    } else {
      setFilteredData(
        props?.data.filter(
          item =>
            item.code.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description.toLowerCase().includes(searchText.toLowerCase()),
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

  const show = (preSelected?: Company[]) => {
    if (preSelected && preSelected.length > 0) {
      setSelectedCompanies(preSelected);
    } else if (props.initialSelected && props.initialSelected.length > 0) {
      setSelectedCompanies(props.initialSelected);
    }
    setVisible(true);
  };
  
  const hide = () => {
    setVisible(false);
    setSearchText(''); // Clear search text
  };

  const handleSelect = () => {
    props.onSelect?.(selectedCompanies);
    setSearchText(''); // Clear search
    setVisible(false);
  };
  
  const handleCancel = () => {
    setSelectedCompanies([]); // Reset selection on cancel
    setSearchText(''); // Clear search
    setVisible(false);
  };

  const unselectAll = () => {
    setSelectedCompanies([]);
    props.onSelect?.([]); // Immediately notify parent
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const renderItem = ({ item, index }: { item: Company; index: number }) => {
    const isSelected = selectedCompanies.some(c => c.code === item.code);

    const toggleSelection = () => {
      setSelectedCompanies(
        prev =>
          isSelected ? prev.filter(c => c.code !== item.code) : [...prev, item], // Multiple selection
      );
    };

    return (
      <TouchableOpacity
        onPress={toggleSelection}
        style={[
          styles.row,
          isSelected && styles.selectedRow,
          index === filteredData.length - 1 && styles.lastRow,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
            {isSelected && <Icon name="check" size={16} color="#ffffff" />}
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.codeText}>{item.code}</Text>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Icon name="check-circle" size={20} color="#10b981" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={48} color="#94a3b8" />
      <Text style={styles.emptyTitle}>No companies found</Text>
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
          onPress={handleCancel}
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
              <Icon name="business" size={24} color="#3b82f6" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Select Company</Text>
              <Text style={styles.subtitle}>
                Choose from {props?.data.length} available companies
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleCancel}
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
              placeholder="Search companies..."
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
          {selectedCompanies.length > 0 && (
            <View style={styles.selectedInfo}>
              <Icon name="check-circle" size={16} color="#10b981" />
              <Text style={styles.selectedText}>
                {selectedCompanies.length} selected
              </Text>
              <TouchableOpacity
                onPress={unselectAll}
                style={styles.unselectButton}
                activeOpacity={0.7}
              >
                <Icon name="clear" size={14} color="#ef4444" />
                <Text style={styles.unselectButtonText}>Unselect All</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={item => item.code}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContent}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectButton,
              !selectedCompanies.length && styles.selectButtonDisabled,
            ]}
            onPress={handleSelect}
            disabled={!selectedCompanies.length}
            activeOpacity={0.8}
          >
            <Text style={styles.selectButtonText}>
              Select
              {selectedCompanies.length > 0
                ? `(${selectedCompanies.length})`
                : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
});

export default CompaniesPopup;

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
    maxHeight: height * 0.85,
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
    backgroundColor: '#eff6ff',
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
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  unselectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
    gap: 4,
  },
  unselectButtonText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedRow: {
    backgroundColor: '#f0f9ff',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  lastRow: {
    marginBottom: 0,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  contentContainer: {
    flex: 1,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  selectedIndicator: {
    marginLeft: 12,
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
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
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
