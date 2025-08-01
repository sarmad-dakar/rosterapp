import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropdownTrigger from '../components/dropdown';
import CompaniesPopup from '../components/popups/companiesPopup';
import RosterGroupPopup from '../components/popups/rosterGroupPopup';
import EmployeesPopup from '../components/popups/employeePopup';

export default function RosterView({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [company, setCompany] = useState('');
  const [rosterGroup, setRosterGroup] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');

  const companyRef = useRef<any>(null);
  const rosterRef = useRef<any>(null);
  const employeeRef = useRef<any>(null);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // keep it open on iOS
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleLoad = () => {
    console.log({
      date,
      company,
      rosterGroup,
      employeeCode,
    });
    let roasterData = {
      date: date.toDateString(),
      company,
      rosterGroup,
      employeeCode,
    };
    navigation.navigate('rosterDetailView', { roasterData });
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Load Roster Data</Text>
          <Text style={styles.subtitle}>
            Select your filters to load roster information
          </Text>
        </View>

        <View style={styles.form}>
          {/* Date Picker Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Selection</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              activeOpacity={0.7}
            >
              <View style={styles.dateContent}>
                <View>
                  <Text style={styles.dateLabel}>Selected Date</Text>
                  <Text style={styles.dateValue}>{formatDate(date)}</Text>
                </View>
                <View style={styles.dateIcon}>
                  <Text style={styles.calendarEmoji}>📅</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* DateTime Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}

          {/* Filters Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filters</Text>
            <View style={styles.filtersContainer}>
              <DropdownTrigger
                label="Company"
                value={company}
                onPress={() => companyRef.current?.show()}
              />
              <DropdownTrigger
                label="Roster Grouping"
                value={rosterGroup}
                onPress={() => rosterRef.current?.show()}
              />
              <DropdownTrigger
                label="Employee Code"
                value={employeeCode}
                onPress={() => employeeRef.current?.show()}
              />
            </View>
          </View>
        </View>

        {/* Load Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loadButton}
            onPress={handleLoad}
            activeOpacity={0.8}
          >
            <Text style={styles.loadButtonText}>Load Roster Data</Text>
          </TouchableOpacity>
        </View>

        {/* Popup components */}
        <CompaniesPopup ref={companyRef} onSelect={setCompany} />
        <RosterGroupPopup ref={rosterRef} onSelect={setRosterGroup} />
        <EmployeesPopup ref={employeeRef} onSelect={setEmployeeCode} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  dateButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  dateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarEmoji: {
    fontSize: 24,
  },
  filtersContainer: {
    gap: 12,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 16,
  },
  loadButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
