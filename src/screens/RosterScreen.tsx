import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { TabScreenParams } from '../navigation/Tabs/RosterTabs';
import ActionButton from '../components/ActionButton';
import { vh } from '../utils/units';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  const animatedHeight = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedHeight, {
        toValue: isOpen ? 1 : 0,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, animatedHeight, rotateAnim]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000],
  });

  const opacity = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.actionsSection}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name="chevron-down" size={24} color="#1A1A1A" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.sectionContent,
          {
            maxHeight,
            opacity,
            overflow: 'hidden',
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const RosterScreen: React.FC<TabScreenParams<'RosterScreen'>> = ({
  navigation,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [openSection, setOpenSection] = useState<string>('shift');

  useEffect(() => {
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

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.title}>Roster</Text>
            <Text style={styles.subtitle}>
              Entries, Transactions & Grouping
            </Text>
          </Animated.View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AccordionSection
          title="Roster Entries"
          isOpen={openSection === 'shift'}
          onToggle={() => handleToggle('shift')}
        >
          <View style={styles.actionButtonsRow}>
            <ActionButton
              icon="calendar-outline"
              label="Roster Entries Simple View"
              onPress={() => {}}
            />
            <ActionButton
              icon="create-outline"
              label="Roster Entries Detailed View"
              onPress={() => {
                navigation.navigate('RosterView');
              }}
            />
            <ActionButton
              icon="grid-outline"
              label="Roster Yearly Calendar View"
              onPress={() => {}}
            />
          </View>
        </AccordionSection>

        <AccordionSection
          title="Roster Statistics"
          isOpen={openSection === 'schedule'}
          onToggle={() => handleToggle('schedule')}
        >
          <View style={styles.actionButtonsRow}>
            <View style={styles.placeholder} />
            <ActionButton
              icon="stats-chart-outline"
              label="Employee Roster Stats Code Statistics"
              onPress={() => {}}
            />
            <ActionButton
              icon="bar-chart-outline"
              label="Roster Shift Code Adjustments"
              onPress={() => {}}
            />
            <View style={styles.placeholder} />
          </View>
        </AccordionSection>

        <AccordionSection
          title="Transactions & Grouping"
          isOpen={openSection === 'bulk'}
          onToggle={() => handleToggle('bulk')}
        >
          <View style={styles.actionButtonsRow}>
            <View style={styles.placeholder} />
            <ActionButton
              icon="swap-horizontal-outline"
              label="Roster Transactions"
              onPress={() => {}}
            />
            <ActionButton
              icon="people-outline"
              label="Roster Grouping"
              onPress={() => {}}
            />
            <View style={styles.placeholder} />
          </View>
        </AccordionSection>
      </ScrollView>
    </View>
  );
};

export default RosterScreen;

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
  actionsSection: {
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionContent: {
    paddingHorizontal: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  placeholder: {
    flex: 0.7,
  },
  scrollContent: {
    paddingBottom: 16,
    paddingTop: 16,
  },
});
