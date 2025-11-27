import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import RosterView from '../../screens/RosterView';
// import RosterDetailView from '../../screens/RosterDetailView';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabScreenProps,
} from '@bottom-tabs/react-navigation';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import EmployeeScreen from '../../screens/EmployeeScreen';
import ProfileTab from '../../screens/ProfileTab';
import RosterScreen from '../../screens/RosterScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { AppNavigatorParamList } from '../AuthNavigator';

const IconImage = (iconName: string) => {
  return Icon.getImageSourceSync(iconName);
};
// "#6B7280"
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
  NativeBottomTabScreenProps<TabParamList, T>;

const Tab = createNativeBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<TabParamList>();

const RosterStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Add other screens here if needed */}
      <Stack.Screen name="RosterScreen" component={RosterScreen} />
      <Stack.Screen
        options={{ headerShown: true }}
        name="RosterView"
        component={RosterView}
      />
    </Stack.Navigator>
  );
};

const tabIcons = {
  Home: 'home',
  'Add Customer': 'person-add',
  Profile: 'person-circle-outline',
  Stats: 'bar-chart',
  EmployeeScreen: 'people-outline',
  SettingsScreen: 'settings-outline',
  RosterStack: 'list',
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
        // tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: '#116cfdff',
        }}
      >
        <Tab.Screen
          name="EmployeeScreen"
          component={EmployeeScreen}
          options={{
            tabBarLabel: 'Employee',
            tabBarIcon: () => IconImage(tabIcons.EmployeeScreen),
          }}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => IconImage(tabIcons.SettingsScreen),
          }}
        />
        <Tab.Screen
          name="RosterStack"
          component={RosterStack}
          options={{
            tabBarLabel: 'Roster',
            tabBarIcon: () => IconImage(tabIcons.RosterStack),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileTab}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: () => IconImage(tabIcons.Profile),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
