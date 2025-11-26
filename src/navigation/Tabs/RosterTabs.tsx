/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import RosterView from '../../screens/RosterView';
// import RosterDetailView from '../../screens/RosterDetailView';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import EmployeeScreen from '../../screens/EmployeeScreen';
import ProfileTab from '../../screens/ProfileTab';
import RosterScreen from '../../screens/RosterScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { AppNavigatorParamList } from '../AuthNavigator';

type TabParamList = {
  Home: undefined;
  'Add Customer': undefined;
  Profile: undefined;
  Stats: undefined;
  EmployeeScreen: undefined;
  RosterStack: undefined;
  SettingsScreen: undefined;
  RosterScreen: undefined;
  RosterView: undefined;
};

export type TabScreenParams<T extends keyof TabParamList> =
  BottomTabScreenProps<TabParamList, T>;

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<TabParamList>();

const RosterStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Add other screens here if needed */}
      <Stack.Screen name="RosterScreen" component={RosterScreen} />
      <Stack.Screen name="RosterView" component={RosterView} />
    </Stack.Navigator>
  );
};

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets();

  const tabIcons = {
    Home: 'home',
    'Add Customer': 'person-add',
    Profile: 'person-circle-outline',
    Stats: 'bar-chart',
    EmployeeScreen: 'people-outline',
    SettingsScreen: 'settings-outline',
    RosterStack: 'list',
  };

  const tabColors = {
    Home: '#3B82F6',
    'Add Customer': '#10B981',
    Profile: '#F59E0B',
    Stats: '#8B5CF6',
    EmployeeScreen: '#EF4444',
    SettingsScreen: '#6366F1',
    RosterStack: '#EC4899',
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : route.name;
          const isFocused = state.index === index;
          const iconName = tabIcons[route.name as keyof typeof tabIcons];
          const color = tabColors[route.name as keyof typeof tabColors];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.6}
            >
              <View
                style={[
                  styles.tabContent,
                  isFocused && [
                    styles.activeTab,
                    { backgroundColor: color, borderRadius: 50 },
                  ],
                ]}
              >
                <Icon
                  name={iconName}
                  size={20}
                  color={isFocused ? '#FFFFFF' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#FFFFFF' : '#6B7280' },
                  ]}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function RoasterTabs() {
  const token = useSelector((state: RootState) => state.auth?.token);
  console.log(token, 'Auth Navigator Token');
  const navigation = useNavigation<NavigationProp<AppNavigatorParamList>>();
  useEffect(() => {
    if (!token) {
      navigation.dispatch(
        CommonActions.navigate('AuthStack', {
          screen: 'CompanyUrl',
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="EmployeeScreen"
          component={EmployeeScreen}
          options={{
            tabBarLabel: 'Employee',
          }}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
          }}
        />
        <Tab.Screen
          name="RosterStack"
          component={RosterStack}
          options={{
            tabBarLabel: 'Roster',
          }}
        />
        {/* <Tab.Screen
          name="Home"
          component={RosterStack}
          options={{
            tabBarLabel: 'Home',
          }}
        />

        <Tab.Screen
          name="Add Customer"
          component={CustomerStack}
          options={{
            tabBarLabel: 'Employees',
          }}
        /> */}
        <Tab.Screen
          name="Profile"
          component={ProfileTab}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 60,
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    // paddingVertical: 10,
    minWidth: 80,
    height: 36,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
