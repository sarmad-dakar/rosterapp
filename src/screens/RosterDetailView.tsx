import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmployeeInfoPopup from '../components/popups/employeeinfoPopup';

const { width } = Dimensions.get('window');

const weekDays = [
  { day: 'Mon', date: 21, month: 'Jul' },
  { day: 'Tue', date: 22, month: 'Jul' },
  { day: 'Wed', date: 23, month: 'Jul' },
  { day: 'Thu', date: 24, month: 'Jul' },
  { day: 'Fri', date: 25, month: 'Jul' },
  { day: 'Sat', date: 26, month: 'Jul' },
  { day: 'Sun', date: 27, month: 'Jul' },
];

const statusConfig = {
  APPROVED: {
    color: '#d1fae5',
    borderColor: '#a7f3d0',
    textColor: '#065f46',
    icon: '✓',
    priority: 1,
  },
  'ON SHIFT': {
    color: '#dbeafe',
    borderColor: '#93c5fd',
    textColor: '#1e40af',
    icon: '●',
    priority: 2,
  },
  PENDING: {
    color: '#fef3c7',
    borderColor: '#fcd34d',
    textColor: '#92400e',
    icon: '⏳',
    priority: 3,
  },
  OPEN: {
    color: '#fecaca',
    borderColor: '#fca5a5',
    textColor: '#991b1b',
    icon: '○',
    priority: 4,
  },
};

// Updated schedule data structure to support multiple shifts per day
const scheduleData = {
  monday: [
    {
      employee: 'Sarah Johnson',
      shifts: [
        {
          timeIn: '9:00am',
          timeOut: '5:00pm',
          breakTime: '1h',
          status: 'APPROVED',
          role: 'Floor Manager',
        },
      ],
    },
    {
      employee: 'Robert Kelso',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Senior Staff',
        },
      ],
    },
    {
      employee: 'Percival Cox',
      shifts: [
        {
          timeIn: '12:00am',
          timeOut: '8:00am',
          breakTime: '15m',
          status: 'PENDING',
          role: 'Night Shift',
        },
      ],
    },
  ],
  tuesday: [
    {
      employee: 'Sarah Johnson',
      shifts: [
        {
          timeIn: '9:00am',
          timeOut: '1:00pm',
          breakTime: '15m',
          status: 'APPROVED',
          role: 'Floor Manager',
        },
        {
          timeIn: '6:00pm',
          timeOut: '10:00pm',
          breakTime: '15m',
          status: 'APPROVED',
          role: 'Floor Manager',
        },
      ],
    },
    {
      employee: 'Mike Torres',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Staff',
        },
      ],
    },
    {
      employee: 'Robert Kelso',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Senior Staff',
        },
      ],
    },
    {
      employee: 'Chris Turk',
      shifts: [
        {
          timeIn: '8:48am',
          timeOut: '4:48pm',
          breakTime: '1h',
          status: 'ON SHIFT',
          role: 'Specialist',
        },
      ],
    },
  ],
  wednesday: [
    {
      employee: 'Sarah Johnson',
      shifts: [
        {
          timeIn: '12:00am',
          timeOut: '8:00am',
          breakTime: '15m',
          status: 'APPROVED',
          role: 'Floor Manager',
        },
      ],
    },
    {
      employee: 'Robert Kelso',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Senior Staff',
        },
      ],
    },
    {
      employee: 'Percival Cox',
      shifts: [
        {
          timeIn: '8:00am',
          timeOut: '2:00pm',
          breakTime: '30m',
          status: 'APPROVED',
          role: 'Day Shift',
        },
        {
          timeIn: '6:00pm',
          timeOut: '12:00am',
          breakTime: '30m',
          status: 'PENDING',
          role: 'Night Shift',
        },
      ],
    },
  ],
  thursday: [
    {
      employee: 'Mike Torres',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Staff',
        },
      ],
    },
    {
      employee: 'Robert Kelso',
      shifts: [
        {
          timeIn: '9:00am',
          timeOut: '5:00pm',
          breakTime: '1h',
          status: 'APPROVED',
          role: 'Senior Staff',
        },
      ],
    },
  ],
  friday: [
    {
      employee: 'Sarah Johnson',
      shifts: [
        {
          timeIn: '6:00am',
          timeOut: '2:00pm',
          breakTime: '30m',
          status: 'APPROVED',
          role: 'Morning Manager',
        },
        {
          timeIn: '6:00pm',
          timeOut: '12:00am',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Evening Manager',
        },
      ],
    },
    {
      employee: 'Chris Turk',
      shifts: [
        {
          timeIn: '10:00am',
          timeOut: '6:00pm',
          breakTime: '1h',
          status: 'APPROVED',
          role: 'Specialist',
        },
      ],
    },
    {
      employee: 'Percival Cox',
      shifts: [
        {
          timeIn: '2:00pm',
          timeOut: '10:00pm',
          breakTime: '45m',
          status: 'PENDING',
          role: 'Night Shift',
        },
      ],
    },
    {
      employee: 'Mike Torres',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Staff',
        },
      ],
    },
  ],
  saturday: [
    {
      employee: 'Weekend Staff',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Staff',
        },
      ],
    },
    {
      employee: 'Chris Turk',
      shifts: [
        {
          timeIn: '10:00am',
          timeOut: '6:00pm',
          breakTime: '1h',
          status: 'APPROVED',
          role: 'Specialist',
        },
      ],
    },
    {
      employee: 'Percival Cox',
      shifts: [
        {
          timeIn: '2:00pm',
          timeOut: '10:00pm',
          breakTime: '45m',
          status: 'PENDING',
          role: 'Night Shift',
        },
      ],
    },
  ],
  sunday: [
    {
      employee: 'Weekend Staff',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          role: 'Staff',
        },
      ],
    },
    {
      employee: 'Chris Turk',
      shifts: [
        {
          timeIn: '10:00am',
          timeOut: '6:00pm',
          breakTime: '1h',
          status: 'APPROVED',
          role: 'Specialist',
        },
      ],
    },
    {
      employee: 'Percival Cox',
      shifts: [
        {
          timeIn: '2:00pm',
          timeOut: '10:00pm',
          breakTime: '45m',
          status: 'PENDING',
          role: 'Night Shift',
        },
      ],
    },
  ],
};

const EmployeeWiseDeputyCalendar = ({ navigation, route }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedCells, setExpandedCells] = useState(new Set());

  const employeeInfoRef = React.useRef(null);

  const handleEmployeePress = employee => {
    employeeInfoRef.current?.show(employee);
  };

  // Extract all unique employees from schedule data
  const getAllEmployees = () => {
    const employeeSet = new Set();
    const employeeDetails = {};

    Object.values(scheduleData).forEach(dayShifts => {
      dayShifts.forEach(employeeData => {
        employeeSet.add(employeeData.employee);
        if (!employeeDetails[employeeData.employee]) {
          // Use the role from the first shift
          employeeDetails[employeeData.employee] = {
            name: employeeData.employee,
            role: employeeData.shifts[0]?.role || 'Staff',
          };
        }
      });
    });

    return Array.from(employeeSet)
      .sort()
      .map(name => employeeDetails[name]);
  };

  // Get shift data for a specific employee on a specific day
  const getEmployeeShiftsForDay = (employeeName, dayKey) => {
    const dayShifts = scheduleData[dayKey] || [];
    const employeeData = dayShifts.find(emp => emp.employee === employeeName);
    return employeeData ? employeeData.shifts : [];
  };

  const getDayKey = day => {
    const dayMap = {
      Mon: 'monday',
      Tue: 'tuesday',
      Wed: 'wednesday',
      Thu: 'thursday',
      Fri: 'friday',
      Sat: 'saturday',
      Sun: 'sunday',
    };
    return dayMap[day];
  };

  const handleShiftPress = (employee, shift) => {
    console.log('Shift pressed:', employee, shift);
  };

  const toggleCellExpansion = (employeeName, dayKey) => {
    const cellKey = `${employeeName}-${dayKey}`;
    const newExpandedCells = new Set(expandedCells);

    if (expandedCells.has(cellKey)) {
      newExpandedCells.delete(cellKey);
    } else {
      newExpandedCells.add(cellKey);
    }

    setExpandedCells(newExpandedCells);
  };

  const renderStatsOverview = () => {
    const allEmployees = getAllEmployees();
    const totalShifts = Object.values(scheduleData).reduce(
      (total, dayShifts) => {
        return (
          total +
          dayShifts.reduce((dayTotal, emp) => dayTotal + emp.shifts.length, 0)
        );
      },
      0,
    );
    const totalEmployees = allEmployees.length;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsContainer}
        contentContainerStyle={styles.statsContent}
      >
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalEmployees}</Text>
          <Text style={styles.statLabel}>Employees</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalShifts}</Text>
          <Text style={styles.statLabel}>Total Shifts</Text>
        </View>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = Object.values(scheduleData)
            .flat()
            .reduce((total, emp) => {
              return (
                total +
                emp.shifts.filter(shift => shift.status === status).length
              );
            }, 0);

          return (
            <View
              key={status}
              style={[
                styles.statCard,
                {
                  backgroundColor: config.color,
                  borderColor: config.borderColor,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: config.textColor }]}>
                {count}
              </Text>
              <Text style={[styles.statLabel, { color: config.textColor }]}>
                {status}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderDateHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.employeeNameColumn}>
        <Text style={styles.headerText}>Emp</Text>
      </View>
      {weekDays.map((day, index) => (
        <View key={index} style={styles.dateColumn}>
          <Text style={styles.dayHeaderText}>{day.day}</Text>
          <Text style={styles.dateHeaderText}>{day.date}</Text>
          <Text style={styles.monthHeaderText}>{day.month}</Text>
        </View>
      ))}
    </View>
  );

  const renderSingleShift = (shift, shiftIndex, totalShifts, isExpanded) => {
    const status = statusConfig[shift.status];

    return (
      <View
        key={shiftIndex}
        style={[
          styles.singleShiftContainer,
          {
            backgroundColor: status.color,
            borderColor: status.borderColor,
            marginBottom: isExpanded && shiftIndex < totalShifts - 1 ? 4 : 0,
          },
        ]}
      >
        <View style={styles.shiftTimeContainer}>
          <Text style={[styles.shiftTimeText, { color: status.textColor }]}>
            IN: {shift.timeIn}
          </Text>
          <Text style={[styles.shiftTimeText, { color: status.textColor }]}>
            OUT: {shift.timeOut}
          </Text>
        </View>
        <Text style={[styles.breakText, { color: status.textColor }]}>
          BREAK: {shift.breakTime}
        </Text>
      </View>
    );
  };

  const renderShiftCell = (employee, day, shifts) => {
    if (!shifts || shifts.length === 0) {
      return (
        <View style={styles.emptyShiftCell}>
          <Text style={styles.noShiftText}>No Shift</Text>
        </View>
      );
    }

    const dayKey = getDayKey(day.day);
    const cellKey = `${employee.name}-${dayKey}`;
    const isExpanded = expandedCells.has(cellKey);
    const hasMultipleShifts = shifts.length > 1;

    // If only one shift, show it normally
    if (!hasMultipleShifts) {
      const shift = shifts[0];
      const status = statusConfig[shift.status];

      return (
        <TouchableOpacity
          style={[
            styles.shiftCell,
            {
              backgroundColor: status.color,
              borderColor: status.borderColor,
            },
          ]}
          onPress={() => handleShiftPress(employee, shift)}
          activeOpacity={0.7}
        >
          {renderSingleShift(shift, 0, 1, false)}
        </TouchableOpacity>
      );
    }

    // Multiple shifts - show collapsed or expanded view
    if (!isExpanded) {
      // Collapsed view - show first shift with counter
      const firstShift = shifts[0];
      const status = statusConfig[firstShift.status];

      return (
        <TouchableOpacity
          style={[
            styles.shiftCell,
            {
              backgroundColor: status.color,
              borderColor: status.borderColor,
            },
          ]}
          onPress={() => toggleCellExpansion(employee.name, dayKey)}
          activeOpacity={0.7}
        >
          {renderSingleShift(firstShift, 0, 1, false)}
          <TouchableOpacity
            style={[
              styles.shiftCounter,
              {
                backgroundColor: status.textColor,
              },
            ]}
            onPress={() => toggleCellExpansion(employee.name, dayKey)}
          >
            <Text style={[styles.shiftCounterText, { color: status.color }]}>
              {shifts.length} shifts
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    // Expanded view - show all shifts
    return (
      <View style={styles.expandedShiftCell}>
        {shifts.map((shift, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleShiftPress(employee, shift)}
            activeOpacity={0.7}
          >
            {renderSingleShift(shift, index, shifts.length, true)}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.collapseButton}
          onPress={() => toggleCellExpansion(employee.name, dayKey)}
        >
          <Text style={styles.collapseButtonText}>▲ Collapse</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmployeeRow = (employee, index) => {
    const isSelected = selectedEmployee === employee.name;

    return (
      <View key={index} style={styles.employeeRowContainer}>
        <View style={styles.employeeRow}>
          <TouchableOpacity
            style={[
              styles.employeeNameColumn,
              isSelected && styles.selectedEmployeeColumn,
            ]}
            onPress={() => handleEmployeePress(employee)}
          >
            <View style={styles.employeeInfo}>
              <Text
                style={[
                  styles.employeeNameText,
                  isSelected && styles.selectedEmployeeText,
                ]}
              >
                {employee.name}
              </Text>
            </View>
          </TouchableOpacity>

          {weekDays.map((day, dayIndex) => {
            const dayKey = getDayKey(day.day);
            const shifts = getEmployeeShiftsForDay(employee.name, dayKey);

            return (
              <View key={dayIndex} style={styles.dateColumn}>
                {renderShiftCell(employee, day, shifts)}
              </View>
            );
          })}
        </View>

        {isSelected && (
          <View style={styles.employeeDetailRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.employeeDetailsContainer}>
                <Text style={styles.employeeDetailTitle}>Weekly Overview</Text>
                <View style={styles.weeklyStats}>
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const count = weekDays.reduce((total, day) => {
                      const dayKey = getDayKey(day.day);
                      const shifts = getEmployeeShiftsForDay(
                        employee.name,
                        dayKey,
                      );
                      return (
                        total +
                        shifts.filter(shift => shift.status === status).length
                      );
                    }, 0);

                    if (count === 0) return null;

                    return (
                      <View
                        key={status}
                        style={[
                          styles.statChip,
                          {
                            backgroundColor: config.color,
                            borderColor: config.borderColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statChipText,
                            { color: config.textColor },
                          ]}
                        >
                          {config.icon} {status}: {count}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Action Buttons Row */}
      <View style={styles.toggleContainer}>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.circleBtn}>
            <Icon name="filter-alt" size={15} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn}>
            <Icon name="mail" size={15} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn}>
            <Icon name="picture-as-pdf" size={15} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn}>
            <Icon name="edit" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Overview */}
      {/* {renderStatsOverview()} */}

      {/* Schedule Table */}
      <View style={styles.scheduleContainer}>
        {/* Date Header */}
        {renderDateHeader()}

        {/* Employee Rows */}
        <ScrollView
          style={styles.employeeList}
          showsVerticalScrollIndicator={false}
        >
          {getAllEmployees().map((employee, index) =>
            renderEmployeeRow(employee, index),
          )}
        </ScrollView>
      </View>
      <EmployeeInfoPopup ref={employeeInfoRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    padding: 5,
  },
  headerButtonText: {
    fontSize: 18,
    color: '#666',
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#003860',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContainer: {
    marginVertical: 16,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    minWidth: 70,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 12,
  },
  employeeNameColumn: {
    width: 55,
    paddingHorizontal: 8,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  selectedEmployeeColumn: {
    backgroundColor: '#eff6ff',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeNameText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  selectedEmployeeText: {
    color: '#2563eb',
  },
  employeeRoleText: {
    fontSize: 9,
    color: '#64748b',
  },
  selectedEmployeeRoleText: {
    color: '#3b82f6',
  },
  expandIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    marginLeft: 6,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  dateColumn: {
    // width: (width - 85) / 7, // Fixed width for proper alignment
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  dayHeaderText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  dateHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a202c',
    marginVertical: 1,
  },
  monthHeaderText: {
    fontSize: 9,
    color: '#64748b',
  },
  employeeList: {
    flex: 1,
  },
  employeeRowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftCell: {
    padding: 2,
    borderRadius: 6,
    borderWidth: 1,
    margin: 1,
    minHeight: 80,
    width: '100%',
    // maxWidth: (width - 140) / 7 - 4, // Ensures it fits within column
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyShiftCell: {
    padding: 6,
    margin: 1,
    minHeight: 80,
    // maxWidth: (width - 140) / 7 - 4, // Ensures it fits within column
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  noShiftText: {
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  shiftTimeContainer: {
    // alignItems: 'center',
    marginBottom: 4,
  },
  shiftTimeText: {
    fontSize: 8,
    fontWeight: '600',
    lineHeight: 10,
    textAlign: 'center',
  },
  breakText: {
    fontSize: 7,
    marginBottom: 4,
    textAlign: 'center',
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 7,
  },
  employeeDetailRow: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  employeeDetailsContainer: {
    paddingHorizontal: 20,
  },
  employeeDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  weeklyStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statChipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  shiftCounter: {
    // position: 'absolute',
    // bottom: 2,
    // right: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
  },
  shiftCounterText: {
    fontSize: 7,
    fontWeight: '600',
    textAlign: 'center',
  },
  collapseButton: {
    marginTop: 4,
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    alignItems: 'center',
  },
  collapseButtonText: {
    fontSize: 7,
    color: '#64748b',
    fontWeight: '500',
  },
  singleShiftContainer: {
    padding: 2,

    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 70,
  },
});

export default EmployeeWiseDeputyCalendar;
