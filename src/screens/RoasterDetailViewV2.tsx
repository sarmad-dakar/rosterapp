import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmployeeInfoPopup from '../components/popups/employeeinfoPopup';

const weekDays = [
  { day: 'Mon', date: 21, month: 'Jul' },
  { day: 'Tue', date: 22, month: 'Jul' },
  { day: 'Wed', date: 23, month: 'Jul' },
  { day: 'Thu', date: 24, month: 'Jul' },
  { day: 'Fri', date: 25, month: 'Jul' },
  { day: 'Sat', date: 26, month: 'Jul' },
  { day: 'Sun', date: 27, month: 'Jul' },
];

const calendarColors = {
  green: '#4caf4f4c',
  pink: '#e91e6243',
  orange: '#ff990058',
  blue: '#2195f34f',
};

const scheduleData = {
  monday: [
    {
      employee: 'Floor Worker',
      shifts: [
        {
          timeIn: '9:00am',
          timeOut: '5:00pm',
          breakTime: '1h',
          status: 'APPROVED',
          color: calendarColors.green,
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
          color: calendarColors.pink,
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
          color: calendarColors.orange,
        },
      ],
    },
  ],
  tuesday: [
    {
      employee: 'Floor Worker',
      shifts: [
        {
          timeIn: '12:00am',
          timeOut: '8:00am',
          breakTime: '15m',
          status: 'APPROVED',
          color: calendarColors.green,
        },
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          color: calendarColors.pink,
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
          color: calendarColors.pink,
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
          color: calendarColors.blue,
        },
      ],
    },
  ],
  wednesday: [
    {
      employee: 'Floor Worker',
      shifts: [
        {
          timeIn: '12:00am',
          timeOut: '8:00am',
          breakTime: '15m',
          status: 'APPROVED',
          color: calendarColors.green,
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
          color: calendarColors.pink,
        },
      ],
    },
    {
      employee: 'Percival Cox',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'PENDING',
          color: calendarColors.orange,
        },
      ],
    },
  ],
  thursday: [
    {
      employee: 'Floor Worker',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          color: calendarColors.pink,
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
          color: calendarColors.green,
        },
      ],
    },
  ],
  friday: [
    {
      employee: 'Floor Worker',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          color: calendarColors.pink,
        },
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          color: calendarColors.pink,
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
          color: calendarColors.green,
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
          color: calendarColors.orange,
        },
        {
          timeIn: '2:00pm',
          timeOut: '10:00pm',
          breakTime: '45m',
          status: 'PENDING',
          color: calendarColors.orange,
        },
      ],
    },
  ],
  saturday: [
    {
      employee: 'Floor Worker',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          color: calendarColors.pink,
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
          color: calendarColors.green,
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
          color: calendarColors.orange,
        },
      ],
    },
  ],
  sunday: [
    {
      employee: 'Floor Worker',
      shifts: [
        {
          timeIn: '1:30pm',
          timeOut: '9:00pm',
          breakTime: '30m',
          status: 'OPEN',
          color: calendarColors.pink,
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
          color: calendarColors.green,
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
          color: calendarColors.orange,
        },
      ],
    },
  ],
};

const RosterDetailViewV2 = () => {
  const [selectedDate, setSelectedDate] = useState(22);
  const [expandedGroups, setExpandedGroups] = useState({});
  const employeeInfoRef = React.useRef(null);

  const handleEmployeePress = employee => {
    employeeInfoRef.current?.show(employee);
  };

  const toggleGroupExpansion = (dayKey, employeeName) => {
    const groupKey = `${dayKey}-${employeeName}`;
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
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

  const renderDateHeader = () => (
    <View style={styles.dateHeader}>
      {weekDays.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dateColumn,
            // selectedDate === day.date && styles.selectedDateColumn,
          ]}
          onPress={() => setSelectedDate(day.date)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDate === day.date && styles.selectedDayText,
            ]}
          >
            {day.day}
          </Text>
          <Text
            style={[
              styles.dateText,
              selectedDate === day.date && styles.selectedDateText,
            ]}
          >
            {day.date}
          </Text>
          <Text
            style={[
              styles.monthText,
              selectedDate === day.date && styles.selectedMonthText,
            ]}
          >
            {day.month}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderShiftBlock = (
    shift,
    index,
    isFirstShift = false,
    hasMultipleShifts = false,
    isExpanded = false,
    onToggleExpand = null,
    employeeName = '',
  ) => (
    <TouchableOpacity
      onPress={() => handleEmployeePress(employeeName)}
      activeOpacity={0.5}
      key={index}
      style={[
        styles.shiftBlock,
        { backgroundColor: shift.color },
        isFirstShift && hasMultipleShifts && styles.firstShiftWithMultiple,
      ]}
    >
      <View style={styles.shiftContent}>
        <View style={styles.shiftInfo}>
          <Text style={styles.shiftTime}>IN : {shift.timeIn}</Text>
          <Text style={styles.shiftTime}>OUT : {shift.timeOut}</Text>
          <Text style={styles.shiftTime}>BREAK : {shift.breakTime}</Text>
        </View>

        {isFirstShift && hasMultipleShifts && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={e => {
              e.stopPropagation();
              onToggleExpand();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={isExpanded ? 'expand-less' : 'expand-more'}
              size={16}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmployeeGroup = (employeeData, groupIndex, dayKey) => {
    const { employee: employeeName, shifts } = employeeData;
    const hasMultipleShifts = shifts.length > 1;
    const groupKey = `${dayKey}-${employeeName}`;
    const isExpanded = expandedGroups[groupKey] || false;

    // Show only first shift if collapsed and has multiple shifts
    const shiftsToShow =
      hasMultipleShifts && !isExpanded ? [shifts[0]] : shifts;

    return (
      <View key={`${employeeName}-${groupIndex}`} style={styles.employeeGroup}>
        <Text style={styles.employeeGroupHeader}>{employeeName}</Text>
        {shiftsToShow.map((shift, shiftIndex) =>
          renderShiftBlock(
            shift,
            `${groupIndex}-${shiftIndex}`,
            shiftIndex === 0, // isFirstShift
            hasMultipleShifts,
            isExpanded,
            () => toggleGroupExpansion(dayKey, employeeName),
            employeeName,
          ),
        )}

        {hasMultipleShifts && isExpanded && (
          <View style={styles.additionalShifts}>
            {shifts
              .slice(1)
              .map((shift, shiftIndex) =>
                renderShiftBlock(
                  shift,
                  `${groupIndex}-additional-${shiftIndex}`,
                  false,
                  false,
                  false,
                  null,
                  employeeName,
                ),
              )}
          </View>
        )}
      </View>
    );
  };

  const renderDayColumn = (day, index) => {
    const dayKey = getDayKey(day.day);
    const employeeData = scheduleData[dayKey] || [];

    return (
      <View key={index} style={styles.dayColumn}>
        <ScrollView
          style={styles.dayScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.dayScrollContent}
        >
          {employeeData.map((employeeGroup, groupIndex) =>
            renderEmployeeGroup(employeeGroup, groupIndex, dayKey),
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.toggleContainer}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
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

      {/* Date Header */}
      {renderDateHeader()}

      {/* Schedule Columns */}
      <View style={styles.scheduleContainer}>
        {weekDays.map((day, index) => renderDayColumn(day, index))}
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
  activeToggle: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
  },
  activeToggleText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  dateHeader: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  selectedDateColumn: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  selectedDayText: {
    // color: '#2196F3',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  selectedDateText: {
    // color: '#2196F3',
  },
  monthText: {
    fontSize: 12,
    color: '#666',
  },
  selectedMonthText: {
    // color: '#2196F3',
  },
  scheduleContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
  },
  dayColumn: {
    flex: 1,
    marginHorizontal: 2,
  },
  dayScrollView: {
    flex: 1,
  },
  dayScrollContent: {
    paddingBottom: 20,
  },
  employeeGroup: {
    marginBottom: 15,
  },
  employeeGroupHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003860',
    marginBottom: 6,
    paddingHorizontal: 4,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    borderRadius: 4,
  },
  shiftBlock: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#adadadff',
  },
  firstShiftWithMultiple: {},
  shiftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shiftInfo: {
    flex: 1,
  },
  expandButton: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 16,
    height: 16,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  employeeName: {
    color: '#000',
    fontSize: 9,
    fontWeight: '400',
    marginBottom: 4,
  },
  shiftTime: {
    color: '#222',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  additionalShifts: {
    marginTop: 6,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  approveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  approveButton: {
    backgroundColor: '#5C4B9F',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#003860ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default RosterDetailViewV2;
