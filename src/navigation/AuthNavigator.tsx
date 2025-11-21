// app/navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import RoasterTabs from './Tabs/RosterTabs';
import ModernLoginScreen from '../screens/CompanyURL';
import LoginScreen from '../screens/LoginScreen';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import RosterTransactionView from '../screens/RosterTransactionView';
// import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyUrl" component={ModernLoginScreen} />
      <Stack.Screen name="loginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default function AuthNavigator() {
  const token = useSelector(state => state.auth?.token);

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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
