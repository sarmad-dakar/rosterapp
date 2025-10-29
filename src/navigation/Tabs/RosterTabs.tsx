/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RosterTransactionView from '../../screens/RosterTransactionView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RosterView from '../../screens/RosterView';
// import RosterDetailView from '../../screens/RosterDetailView';
import RosterDetailViewV2 from '../../screens/RoasterDetailViewV2';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RosterStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="rosterView" component={RosterView} />
      <Stack.Screen name="rosterDetailView" component={RosterDetailViewV2} />
      {/* Add other screens here if needed */}
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
    Billing: 'receipt',
    Stats: 'bar-chart',
  };

  const tabColors = {
    Home: '#3B82F6',
    'Add Customer': '#10B981',
    Billing: '#F59E0B',
    Stats: '#8B5CF6',
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
  return (
    <>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={RosterStack}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Add Customer"
          component={RosterTransactionView}
          options={{
            tabBarLabel: 'Add Employee',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    marginLeft: 6,
    textAlign: 'center',
  },
});
