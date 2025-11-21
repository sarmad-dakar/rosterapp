import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { getDynamicTableData } from '../api/rosterSchedule';
import { dynamicTableEnum } from '../utils/dummyJson';
import { useSelector } from 'react-redux';
import { vh } from '../utils/units';
// Import from react-native-vector-icons
// Make sure to install: npm install react-native-vector-icons
// import Icon from 'react-native-vector-icons/Feather';

const EmployeeList = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployeeData] = useState([]);
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

  const handleEdit = (code: string) => {
    console.log(`Edit employee: ${code}`);
    navigation.navigate('rosterTransactionView', {
      employeeCode: code,
      title: 'Employee Career',
    });
    // Add your edit navigation logic here
  };

  const getInitials = (name: string, surName: string) => {
    return `${name.charAt(0)}${surName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <View
              style={[styles.detailsRowHalf, { justifyContent: 'flex-end' }]}
            >
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          {/* Replace with: <Icon name="search" size={18} color="#94a3b8" /> */}
          <Text style={styles.searchIconText}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search People..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {filteredEmployees.length > 0 ? (
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeCard}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No employees found matching your search.
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: vh * 7,
    // paddingTop: vh * 10,
  },
  searchIconText: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
  },
});
