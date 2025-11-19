import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useMemo } from 'react';

interface TableData {
  [key: string]: string | number;
}

interface TableViewModalProps {
  tableData: TableData[];
  title?: string;
  onClose?: () => void;
  onChange?: (selectedRows: TableData[]) => void;
}

const TableViewModal: React.FC<TableViewModalProps> = ({
  tableData,
  title = 'Select a PayGroup',
  onClose,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Extract column names from first object
  const columns = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];
    return Object.keys(tableData[0]);
  }, [tableData]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;

    return tableData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [tableData, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, filteredData.length);

  // Format column name for display
  const formatColumnName = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Toggle row selection
  const toggleRowSelection = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle done button press
  const handleDone = () => {
    if (onChange) {
      const selected = Array.from(selectedRows).map(index => tableData[index]);
      onChange(selected);
    }
  };

  // Get original index for a filtered row
  const getOriginalIndex = (paginatedIndex: number): number => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredRow = filteredData[startIndex + paginatedIndex];
    return tableData.findIndex(row => row === filteredRow);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerButtons}>
          {selectedRows.size > 0 && (
            <Text style={styles.selectedCount}>
              {selectedRows.size} selected
            </Text>
          )}
          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.showEntries}>
          <Text style={styles.controlLabel}>Show</Text>
          <View style={styles.picker}>
            <Text style={styles.pickerText}>{entriesPerPage}</Text>
          </View>
          <Text style={styles.controlLabel}>entries</Text>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search:</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder=""
          />
        </View>
      </View>

      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            {onChange && (
              <View style={[styles.tableHeaderCell, styles.checkboxColumn]}>
                <Text style={styles.tableHeaderText}>Select</Text>
              </View>
            )}
            {columns.map((column, index) => (
              <View
                key={column}
                style={[
                  styles.tableHeaderCell,
                  index === 0 && styles.firstColumn,
                ]}
              >
                <Text style={styles.tableHeaderText}>
                  {formatColumnName(column)}
                </Text>
              </View>
            ))}
          </View>

          {/* Table Body */}
          {paginatedData.map((row, rowIndex) => {
            const originalIndex = getOriginalIndex(rowIndex);
            const isSelected = selectedRows.has(originalIndex);

            return (
              <View
                key={rowIndex}
                style={[
                  styles.tableRow,
                  rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow,
                  isSelected && styles.selectedRow,
                ]}
              >
                {onChange && (
                  <TouchableOpacity
                    style={[styles.tableCell, styles.checkboxColumn]}
                    onPress={() => toggleRowSelection(originalIndex)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                )}
                {columns.map((column, colIndex) => (
                  <View
                    key={`${rowIndex}-${column}`}
                    style={[
                      styles.tableCell,
                      colIndex === 0 && styles.firstColumn,
                    ]}
                  >
                    <Text style={styles.tableCellText}>
                      {String(row[column])}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {startEntry} to {endEntry} of {filteredData.length} entries
        </Text>

        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.paginationButtonDisabled,
            ]}
            onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <Text style={styles.paginationButtonText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.paginationCurrent}>
            <Text style={styles.paginationCurrentText}>{currentPage}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.paginationButtonDisabled,
            ]}
            onPress={() =>
              setCurrentPage(prev => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            <Text style={styles.paginationButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Done Button */}
      {onChange && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.doneButton,
              selectedRows.size === 0 && styles.doneButtonDisabled,
            ]}
            onPress={handleDone}
            disabled={selectedRows.size === 0}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TableViewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#ef4444',
    fontWeight: '300',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  showEntries: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
  },
  pickerText: {
    fontSize: 14,
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 200,
    fontSize: 14,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderCell: {
    padding: 12,
    minWidth: 200,
    backgroundColor: '#f9fafb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tableCell: {
    padding: 12,
    minWidth: 200,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  tableCellText: {
    fontSize: 14,
    color: '#6b7280',
  },
  firstColumn: {
    minWidth: 150,
  },
  checkboxColumn: {
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  evenRow: {
    backgroundColor: '#f9fafb',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  selectedRow: {
    backgroundColor: '#eff6ff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 18,
    color: '#6b7280',
  },
  paginationCurrent: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationCurrentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  actionContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  doneButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  doneButtonDisabled: {
    backgroundColor: '#93c5fd',
    opacity: 0.5,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
