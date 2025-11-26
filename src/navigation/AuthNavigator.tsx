// app/navigation/AuthNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import ModernLoginScreen from '../screens/CompanyURL';
import EmployeeList from '../screens/EmployeeList';
import LoginScreen from '../screens/LoginScreen';
import RosterDetailViewV2 from '../screens/RoasterDetailViewV2';
import RosterTransactionView from '../screens/RosterTransactionView';
import RoasterTabs from './Tabs/RosterTabs';
import { RootState } from '../redux/store';

export type AppNavigatorParamList = {
  AuthStack: undefined;
  Home: undefined;
  rosterTransactionView: { title: string; transactionId: string };
  rosterDetailView: { rosterId: string };
  customerList: {
    screen: keyof AppNavigatorParamList;
  };
  CompanyUrl: undefined;
  loginScreen: undefined;
};

export type AppNavigatorScreenParams<T extends keyof AppNavigatorParamList> =
  NativeStackNavigationProp<AppNavigatorParamList, T>;

const Stack = createNativeStackNavigator<AppNavigatorParamList>();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyUrl" component={ModernLoginScreen} />
      <Stack.Screen name="loginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default function AuthNavigator() {
  const token = useSelector((state: RootState) => state.auth?.token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token == null ? (
          <Stack.Screen name="AuthStack" component={AuthStackNavigator} />
        ) : (
          <>
            <Stack.Screen name="Home" component={RoasterTabs} />
            <Stack.Screen
              name="rosterTransactionView"
              component={RosterTransactionView}
              options={props => ({
                headerShown: true,
                headerBackTitle: '',
                title: props.route.params?.title,
              })}
            />
            <Stack.Screen
              name="rosterDetailView"
              component={RosterDetailViewV2}
              options={{
                headerShown: true,
                headerTitle: '',
                headerBackTitle: '',
              }}
            />
            <Stack.Screen
              name="customerList"
              component={EmployeeList}
              options={{
                headerShown: true,
                headerTitle: '',
                headerBackTitle: '',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
