import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import EmployeeInfoPopup from '../components/popups/employeeinfoPopup';
import { getRosterSchedules } from '../api/rosterSchedule';
import moment from 'moment';
import { vh } from '../utils/units';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';

// const weekDays = [
//   { day: 'Mon', date: 21, month: 'Jul' },
//   { day: 'Tue', date: 22, month: 'Jul' },
//   { day: 'Wed', date: 23, month: 'Jul' },
//   { day: 'Thu', date: 24, month: 'Jul' },
//   { day: 'Fri', date: 25, month: 'Jul' },
//   { day: 'Sat', date: 26, month: 'Jul' },
//   { day: 'Sun', date: 27, month: 'Jul' },
// ];

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

const RosterDetailViewV2 = ({ route }) => {
  const [selectedDate, setSelectedDate] = useState(22);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [weekDays, setWeekDays] = useState([]);
  const employeeInfoRef = React.useRef(null);
  const employeeCodes = route?.params?.employeeCodes;
  const [scheduleTesting, setScheduleTesting] = useState();
  const employeeData = route?.params?.employeeData;
  const rosterDate = route?.params?.selectedDate;
  const [currentSelectedDate, setCurrentSelectedDate] = useState(
    moment(rosterDate),
  );
  const insets = useSafeAreaInsets();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    sortJson(employeeData, rosterDate);
  }, [employeeData]);

  useEffect(() => {
    if (scheduleTesting) {
      // fetchScheduleData();
    }
  }, [scheduleTesting]);

  const sortJson = (data, calendarDate) => {
    setLoadingState(true);

    let dummyWeekdays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    let basicObject = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    setCurrentSelectedDate(moment(calendarDate));
    setDateFrom(moment(calendarDate));
    setDateTo(moment(calendarDate).add(6, 'days'));

    let tempWeekDays = [];
    for (let index = 0; index < 7; index++) {
      let currentDate = moment(calendarDate).add(index, 'days');
      let object = {
        day: currentDate.format('ddd'),
        date: currentDate.format('DD'),
        month: currentDate.format('MMM'),
      };
      tempWeekDays.push(object);
    }
    setWeekDays(tempWeekDays);

    dummyWeekdays.forEach(day => {
      data.forEach(employee => {
        let employeeObject = {
          employee: employee,
          attributes: {
            backColor: '',
            date: '',
            foreColor: calendarColors.green,
            shiftHours: '',
          },
          shifts: [
            {
              shiftCode: null,
              shiftDesc: 'Day',
              shiftTimeFrom: '09:00:00',
              shiftTimeTo: '17:00:00',
              shiftBreak: '00:15',
              color: calendarColors.green,
            },
          ],
        };
        basicObject[day].push(employeeObject);
      });
    });
    // setScheduleTesting(basicObject);
    fetchScheduleData(basicObject);
    console.log('Sorted Data:', basicObject);
  };

  const fetchScheduleData = async basicObject => {
    try {
      const apiObject = {
        dateFrom: moment(rosterDate).format('YYYY-MM-DD'),
        dateTo: moment(rosterDate).add(6, 'days').format('YYYY-MM-DD'),
        employeeCodes: employeeData.map(emp => emp.code),
        pageNo: 1,
        isDetailed: 1,
      };
      console.log(apiObject, 'scheduled data api object');
      const response = await getRosterSchedules(apiObject);
      setLoadingState(false);
      console.log(response, 'Schedule Data response');
      sortScheduleData(response?.data, basicObject);
    } catch (error) {
      setLoadingState(false);
    }
  };

  const sortScheduleData = (data, basicObject) => {
    try {
      let scheduleObject = basicObject;
      console.log(scheduleObject, 'shedule object before');
      data.forEach((shiftObject, shiftObjectIndex) => {
        console.log(shiftObject?.rosterShifts, 'shiftObject?.rosterShifts');
        shiftObject?.rosterShifts?.forEach((shift, shiftIndex) => {
          console.log(
            scheduleObject[moment(shift.date).format('dddd').toLowerCase()][
              shiftObjectIndex
            ],
            'shedule object day',
          );
          console.log(moment(shift.date).format('dddd'));
          scheduleObject[moment(shift.date).format('dddd').toLowerCase()][
            shiftObjectIndex
          ].shifts = shift?.shifts;

          scheduleObject[moment(shift.date).format('dddd').toLowerCase()][
            shiftObjectIndex
          ].attributes = {
            backColor: shift?.backColor,
            date: shift?.date,
            foreColor: shift?.foreColor,
            shiftHours: shift?.shiftHours,
          };
        });
      });
      setScheduleTesting(scheduleObject);
      console.log(scheduleObject, 'shedule object after');
    } catch (error) {
      console.log(error, 'error in sorting schedule data');
    }
  };

  const handleEmployeePress = employee => {
    employeeInfoRef.current?.show(employee);
  };

  const toggleGroupExpansion = (dayKey, employeeName) => {
    const groupKey = `${dayKey}-${employeeName}`;
    console.log(groupKey, 'groupKeys');
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
  const handleNextDate = () => {
    // console.log(currentSelectedDate, 'next date pressed');
    sortJson(employeeData, currentSelectedDate?.add(7, 'days'));
  };

  const handlePreviousDate = () => {
    // console.log(currentSelectedDate, 'previous date pressed');
    sortJson(employeeData, currentSelectedDate?.subtract(7, 'days'));
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
    attributes,
  ) => (
    <View
      activeOpacity={0.5}
      key={index}
      style={[
        styles.shiftBlock,
        { backgroundColor: attributes?.backColor || calendarColors.green },
        isFirstShift && hasMultipleShifts && styles.firstShiftWithMultiple,
      ]}
    >
      {!shift?.shiftCode ? (
        <Text style={{ fontSize: 10 }}>-No Shift-</Text>
      ) : (
        <View style={styles.shiftContent}>
          <View style={styles.shiftInfo}>
            <Text
              style={[
                styles.shiftTime,
                { color: attributes?.foreColor || '#000' },
              ]}
            >
              {shift?.shiftCode || `\nN/A`}
            </Text>

            <Text
              style={[
                styles.shiftTime,
                { color: attributes?.foreColor || '#000' },
              ]}
            >
              <Text style={{ color: 'black' }}>IN :</Text>{' '}
              {shift.shiftTimeFrom || `\nN/A`}
            </Text>

            <Text
              style={[
                styles.shiftTime,
                { color: attributes?.foreColor || '#000' },
              ]}
            >
              <Text style={{ color: 'black' }}>OUT :</Text>{' '}
              {shift.shiftTimeTo || `\nN/A`}
            </Text>
            <Text
              style={[
                styles.shiftTime,
                { color: attributes?.foreColor || '#000' },
              ]}
            >
              <Text style={{ color: 'black' }}>BREAK :</Text>{' '}
              {shift.shiftBreak || `\nN/A`}
            </Text>
          </View>

          {isFirstShift && hasMultipleShifts && (
            <TouchableOpacity
              style={[styles.expandButton]}
              onPress={e => {
                console.log('hellow ');
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
      )}
    </View>
  );

  const shouldShowNewBlock = (multipleShifts, isExpanded) => {
    if (multipleShifts && isExpanded) {
      return true;
    } else {
      return false;
    }
  };

  const renderEmployeeGroup = (employeeData, groupIndex, dayKey) => {
    const { employee: employeeName, shifts, attributes } = employeeData;
    const hasMultipleShifts = shifts.length > 1;
    const groupKey = `${dayKey}-${employeeName?.name}`;
    const isExpanded = expandedGroups[groupKey] || false;
    // Show only first shift if collapsed and has multiple shifts
    const shiftsToShow = shouldShowNewBlock(hasMultipleShifts, isExpanded)
      ? [shifts[0]]
      : [shifts[0]];

    console.log(shifts.slice(1), shiftsToShow, isExpanded, 'shifts to show');

    return (
      <View
        key={`-${groupIndex}`}
        style={[
          styles.employeeGroup,
          { height: isExpanded ? vh * 23 * shifts.length : vh * 23 },
        ]}
      >
        <TouchableOpacity onPress={() => handleEmployeePress(employeeName)}>
          <Text numberOfLines={1} style={styles.employeeGroupHeader}>
            {employeeName?.name}
          </Text>
        </TouchableOpacity>
        {shiftsToShow.map((shift, shiftIndex) =>
          renderShiftBlock(
            shift,
            `${groupIndex}-${shiftIndex}`,
            shiftIndex === 0, // isFirstShift
            hasMultipleShifts,
            isExpanded,
            () => toggleGroupExpansion(dayKey, employeeName?.name),
            employeeName?.name,
            attributes,
          ),
        )}

        {shouldShowNewBlock(hasMultipleShifts, isExpanded) && (
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
                  employeeName?.name,
                  attributes,
                ),
              )}
          </View>
        )}
      </View>
    );
  };

  const renderDayColumn = (day, index) => {
    const dayKey = getDayKey(day.day);
    const employeeData = scheduleTesting[dayKey] || [];
    const SHIFT_BLOCK_HEIGHT = vh * 23;

    return (
      <View key={index} style={styles.dayColumn}>
        <ScrollView
          style={styles.dayScrollView}
          showsVerticalScrollIndicator={false}
          decelerationRate="fast" // Makes it snap quickly like reels
          snapToAlignment="start" // Snaps to the start of each block
          snapToInterval={SHIFT_BLOCK_HEIGHT} // Height of each shift block
          contentContainerStyle={styles.dayScrollContent}
        >
          {employeeData?.map((employeeGroup, groupIndex) =>
            renderEmployeeGroup(employeeGroup, groupIndex, dayKey),
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
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
      <View style={styles.weekNavigationContainer}>
        {/* Previous Week Button */}
        <TouchableOpacity
          onPress={() => handlePreviousDate()}
          activeOpacity={0.8}
          style={styles.navButton}
        >
          <LinearGradient
            colors={colors.btnGradiant}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navButtonGradient}
          >
            <Icon name="chevron-left" size={16} color="#fff" />
            <Text style={styles.navButtonText}>Previous</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Next Week Button */}
        <TouchableOpacity
          onPress={() => handleNextDate()}
          activeOpacity={0.8}
          style={styles.navButton}
        >
          <LinearGradient
            colors={colors.btnGradiant}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navButtonGradient}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <Icon name="chevron-right" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {loadingState ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : !employeeData || employeeData.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateContent}>
            <Icon name="event-busy" size={64} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>No Records Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              There are no employees scheduled for this roster.
            </Text>
            <Text style={styles.emptyStateHint}>
              Please select employees to view their schedule.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.scheduleContainer}>
          {scheduleTesting
            ? weekDays.map((day, index) => renderDayColumn(day, index))
            : null}
        </View>
      )}

      {/* Schedule Columns */}

      <EmployeeInfoPopup ref={employeeInfoRef} />
    </View>
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
    paddingBottom: 70,
  },
  employeeGroup: {
    // marginBottom: 15,
    height: vh * 23,
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
    fontSize: vh * 1,
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
  weekNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navButton: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  emptyStateHint: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default RosterDetailViewV2;
