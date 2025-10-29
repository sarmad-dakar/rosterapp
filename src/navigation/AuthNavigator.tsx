// app/navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RoasterTabs from './Tabs/RosterTabs';
import ModernLoginScreen from '../screens/CompanyURL';
import LoginScreen from '../screens/LoginScreen';
import { useSelector } from 'react-redux';
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
  console.log(token, 'Auth Navigator Token');
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token == null ? (
          <Stack.Screen name="AuthStack" component={AuthStackNavigator} />
        ) : null}
        <Stack.Screen name="Home" component={RoasterTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
