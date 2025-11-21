import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropdownTrigger from '../components/dropdown';
import CompaniesPopup from '../components/popups/companiesPopup';
import RosterGroupPopup from '../components/popups/rosterGroupPopup';
import EmployeesPopup from '../components/popups/employeePopup';
import { dynamicTableEnum } from '../utils/dummyJson';
import { getDynamicTableData, getRosterEmployees } from '../api/rosterSchedule';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployees } from '../redux/slices/authSlice';
import LinearGradient from 'react-native-linear-gradient';
import { vh } from '../utils/units';

export default function RosterView({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [company, setCompany] = useState([]);
  const [rosterGroup, setRosterGroup] = useState([]);
  const [employeeCode, setEmployeeCode] = useState([]);

  const [companyData, setCompanyData] = useState([]);
  const [rosterGroupData, setRosterGroupData] = useState([]);
  const allEmployees = useSelector(state => state.auth?.employees);
  const [loading, setLoading] = useState(false);
  const [dataFetching, setDataFetching] = useState(true);
  const dispatch = useDispatch();

  const companyRef = useRef<any>(null);
  const rosterRef = useRef<any>(null);
  const employeeRef = useRef<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchCompanyData();
    fetchRosterData();
    fetchEmployeeData();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const object = {
        tableDataEnum: dynamicTableEnum.CompanyCode,
        apiParams: '',
      };
      const response = await getDynamicTableData(object);
      setCompanyData(response?.data || []);
    } catch (error) {
      console.log('Error fetching company data:', error);
    }
  };

  const fetchRosterData = async () => {
    try {
      const object = {
        tableDataEnum: dynamicTableEnum.RosterGroupings,
        apiParams: '',
      };
      const response = await getDynamicTableData(object);
      setRosterGroupData(response?.data || []);
    } catch (error) {
      console.log('Error fetching roster data:', error);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const object = {
        tableDataEnum: dynamicTableEnum.Employees,
        apiParams: '',
      };
      const response = await getDynamicTableData(object);
      dispatch(updateEmployees(response?.data));
    } catch (error) {
      console.log('Error fetching employee data:', error);
    }
    setDataFetching(false);
  };

  const handleLoad = async () => {
    try {
      let roasterData = {
        selectedDate: moment(date).format('YYYY-MM-DD'),
        companyCodes: company?.map(item => item.code) || [],
        rosterGroupings: rosterGroup?.map(item => item.code) || [],
        employeeCodes: employeeCode?.map(item => item.code) || [],
        rosterSort: '',
        pageNo: 1,
        endingDate: '',
        weekDuration: 1,
      };
      setLoading(true);
      const response = await getRosterEmployees(roasterData);
      setLoading(false);
      if (response?.data) {
        navigation.navigate('rosterDetailView', {
          employeeData: response?.data?.employees,
          employeeCodes: roasterData.employeeCodes,
          selectedDate: moment(date),
        });
      }
    } catch (error) {
      console.log('Error fetching roster employees data:', error);
      setLoading(false);
    }
  };

  const formatDate = date => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return { day, month, year, weekday };
  };

  const dateInfo = formatDate(date);

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Modern Header with Gradient */}
        <View style={styles.headerContainer}>
          <View style={styles.headerGradient}>
            <LinearGradient
              colors={['#0d4483', '#1a5da8', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradientInner}
            />
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.title}>Roster Schedule</Text>
              <Text style={styles.subtitle}>
                Configure and load your roster data
              </Text>
            </Animated.View>
          </View>
        </View>

        <Animated.ScrollView
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Card */}
          <View style={styles.statsCard}>
            {dataFetching ? (
              <ActivityIndicator
                size="small"
                color="#0d4483"
                style={{
                  width: '100%',
                  height: vh * 6,
                  alignSelf: 'center',
                  // zIndex: dataFetching ? 1 : -1,
                }}
              />
            ) : (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{companyData?.length}</Text>
                  <Text style={styles.statLabel}>Companies</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {rosterGroupData?.length}
                  </Text>
                  <Text style={styles.statLabel}>Groups</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{allEmployees?.length}</Text>
                  <Text style={styles.statLabel}>Employees</Text>
                </View>
              </>
            )}
          </View>

          {/* Modern Date Card */}
          <View style={styles.dateSection}>
            <Text style={styles.sectionLabel}>Select Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateCard}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#0d4483', '#1a5da8', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dateGradient}
              />
              <View style={styles.dateLeft}>
                <Text style={styles.dateDay}>{dateInfo.day}</Text>
                <Text style={styles.dateMonth}>{dateInfo.month}</Text>
              </View>
              <View style={styles.dateDivider} />
              <View style={styles.dateRight}>
                <Text style={styles.dateWeekday}>{dateInfo.weekday}</Text>
                <Text style={styles.dateYear}>{dateInfo.year}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}

          {/* Filters Section */}
          <View style={styles.filtersSection}>
            <Text style={styles.sectionLabel}>Filter Options</Text>
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
        </Animated.ScrollView>

        {/* Modern Load Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loadButton}
            onPress={handleLoad}
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient
              colors={
                loading
                  ? ['#94a3b8', '#cbd5e1']
                  : ['#0d4483', '#1a5da8', '#2563eb']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            />
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loadButtonText}>Load Roster Data</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Popup components */}
        <CompaniesPopup
          data={companyData}
          ref={companyRef}
          onSelect={setCompany}
        />
        <RosterGroupPopup
          data={rosterGroupData}
          ref={rosterRef}
          onSelect={setRosterGroup}
        />
        <EmployeesPopup
          data={allEmployees}
          ref={employeeRef}
          onSelect={setEmployeeCode}
        />
      </View>
    </View>
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
  headerContainer: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 5,
    paddingTop: Platform.OS == 'ios' ? vh * 8 : vh * 7,
    paddingHorizontal: 24,
  },
  headerGradientInner: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    gap: 1,
  },
  title: {
    fontSize: vh * 2.5,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  dateSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0d4483',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dateGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dateLeft: {
    alignItems: 'center',
    minWidth: 70,
  },
  dateDay: {
    fontSize: vh * 3,
    fontWeight: '800',
    color: '#ffffff',
    // lineHeight: 44,
  },
  dateMonth: {
    fontSize: vh * 2,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateDivider: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  dateRight: {
    flex: 1,
  },
  dateWeekday: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  dateYear: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filtersSection: {
    paddingHorizontal: 24,
    paddingTop: 5,
  },
  filtersContainer: {
    gap: 14,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0d4483',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e2e8f0',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  loadButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
