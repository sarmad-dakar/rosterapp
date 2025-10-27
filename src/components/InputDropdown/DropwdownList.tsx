import React, { FC, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface DropdownItem {
  description: string;
  otherLanguage?: string;
  internalCode?: string;
  [key: string]: any;
}

interface DropdownListProps {
  visible: boolean;
  onClose: () => void;
  data: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  title?: string;
  displayKey?: string;
  searchPlaceholder?: string;
}

const DropdownList: FC<DropdownListProps> = ({
  visible,
  onClose,
  data,
  onSelect,
  title = 'Select an Option',
  displayKey = 'description',
  searchPlaceholder = 'Search...',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [data, searchQuery]);

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setSearchQuery('');
    onClose();
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: DropdownItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        index % 2 === 0 ? styles.evenRow : styles.oddRow,
      ]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.listItemText} numberOfLines={2}>
        {item[displayKey] || item.description || ''}
      </Text>
      {item.internalCode && item.internalCode.trim() !== '' && (
        <Text style={styles.listItemSubtext} numberOfLines={1}>
          Code: {item.internalCode}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="inbox" size={48} color="#d1d5db" />
      <Text style={styles.emptyText}>No results found</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <FontAwesome
              name="search"
              size={16}
              color="#9ca3af"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome name="times-circle" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* List Container */}
          <View style={styles.listContainer}>
            {filteredData.length === 0 ? (
              renderEmptyComponent()
            ) : (
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item, index) => `dropdown-item-${index}`}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.listContent}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={false}
              />
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Showing {filteredData.length} of {data.length} entries
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DropdownList;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: '90%',
    maxWidth: 600,
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    padding: 0,
    height: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 8,
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 6,
  },
  evenRow: {
    backgroundColor: '#f9fafb',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  listItemText: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
    marginBottom: 4,
  },
  listItemSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
});
