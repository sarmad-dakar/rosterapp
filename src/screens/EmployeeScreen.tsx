import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { getDynamicTableData } from '../api/rosterSchedule';
import ActionButton from '../components/ActionButton';
import { AppNavigatorParamList } from '../navigation/AuthNavigator';
import { TabScreenParams } from '../navigation/Tabs/RosterTabs';
import { updateEmployees } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { colors } from '../utils/colors';
import { dynamicTableEnum } from '../utils/dummyJson';
import { vh } from '../utils/units';
const { width } = Dimensions.get('window');

interface Employee {
  code: string;
  idCard: string;
  name: string;
  surName: string;
  dateOfBirth: string;
  age: string;
  current: string;
  allName: string;
  companyCode: string;
  jobCode: string;
  jobDesc: string;
  scheduleCode: string;
  scheduleDesc: string;
  rosterGrouping: any[];
}

const DataItem: React.FC<{
  label: string;
  value: string | number;
  color: string;
}> = ({ label, value, color }) => (
  <View style={styles.dataItem}>
    <View style={[styles.colorDot, { backgroundColor: color }]} />
    <Text style={styles.dataItemLabel}>{label}</Text>
    <Text style={styles.dataItemValue}>{value}</Text>
  </View>
);

const Dashboard: React.FC<TabScreenParams<'EmployeeScreen'>> = ({}) => {
  const navigation = useNavigation<NavigationProp<AppNavigatorParamList>>();
  const allEmployees = useSelector((state: RootState) => state.auth?.employees);
  const [dataFetching, setDataFetching] = useState(true);
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const stats = useMemo(() => {
    const totalEmployees = allEmployees.length;
    const currentEmployees = allEmployees.filter(
      (e: Employee) => e.current === 'Yes',
    ).length;

    return {
      totalEmployees,
      currentEmployees,
      inactiveEmployees: totalEmployees - currentEmployees,
      currentPercentage:
        totalEmployees > 0
          ? Math.round((currentEmployees / totalEmployees) * 100)
          : 0,
    };
  }, [allEmployees]);

  const chartData = [
    {
      name: 'Active',
      population: stats.currentEmployees,
      color: '#0d4483',
      legendFontColor: '#666',
      legendFontSize: 12,
    },
    {
      name: 'Inactive',
      population: stats.inactiveEmployees,
      color: '#cbcbcbff',
      legendFontColor: '#666',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
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
            <Text style={styles.title}>Employee</Text>
            <Text style={styles.subtitle}>Employee & Company Overview</Text>
          </Animated.View>
        </View>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.chartSection}>
        <CircularChart
          percentage={stats.currentPercentage}
          label="Active"
          color="#4CAF50"
        />
      </View> */}
        <View style={styles.chartSection}>
          <PieChart
            data={chartData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
            hasLegend
            avoidFalseZero
          />
        </View>

        <View style={styles.dataSection}>
          <View style={styles.dataCard}>
            <DataItem
              label="Total Employees"
              value={stats.totalEmployees}
              color="#2196F3"
            />
            <DataItem
              label="Active Employees"
              value={stats.currentEmployees}
              color="#4CAF50"
            />
            <DataItem
              label="Inactive Employees"
              value={stats.inactiveEmployees}
              color="#FF9800"
            />
          </View>

          {/* <View style={styles.dataCard}>
          <DataItem
            label="Companies"
            value={stats.totalCompanies}
            color="#F44336"
          />
          <DataItem
            label="Departments"
            value={stats.totalDepartments}
            color="#9C27B0"
          />
          <DataItem
            label="Roster Groups"
            value={stats.totalRosterGroups}
            color="#607D8B"
          />
        </View> */}
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <ActionButton
              icon="person-outline"
              label="Employee Details"
              onPress={() => {
                navigation.navigate('customerList', {
                  screen: 'rosterDetailView',
                });
              }}
            />
            <ActionButton
              icon="briefcase-outline"
              label="Employee Career"
              onPress={() => {}}
            />
            <ActionButton
              icon="calendar-outline"
              label="Employee Schedule"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
      {dataFetching && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 5,
    paddingTop: Platform.OS === 'ios' ? vh * 8 : vh * 7,
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
  chartSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    boxShadow: '0 1px 6px 2px rgba(0,0,0,0.1)',
  },
  dataSection: {
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    boxShadow: '0 1px 6px 2px rgba(0,0,0,0.1)',
  },
  dataItem: {
    flex: 1,
    alignItems: 'center',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  dataItemLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  dataItemValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Dashboard;
