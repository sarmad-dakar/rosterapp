import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from '../components/ActionButton';
import { TabScreenParams } from '../navigation/Tabs/RosterTabs';
import { vh } from '../utils/units';

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

const SettingsScreen: React.FC<TabScreenParams<'SettingsScreen'>> = ({}) => {
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
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Shift & Schedule</Text>
          </Animated.View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AccordionSection
          title="Shift Settings"
          isOpen={openSection === 'shift'}
          onToggle={() => handleToggle('shift')}
        >
          <View style={styles.actionButtonsRow}>
            <ActionButton
              icon="briefcase-outline"
              label="Shift Defination Details"
              onPress={() => {}}
            />
            <ActionButton
              icon="document-text-outline"
              label="Shift Rule Defination Details"
              onPress={() => {}}
            />
            <ActionButton
              icon="layers-outline"
              label="Shift Grouping Defination Details"
              onPress={() => {}}
            />
          </View>
        </AccordionSection>

        <AccordionSection
          title="Schedule Settings"
          isOpen={openSection === 'schedule'}
          onToggle={() => handleToggle('schedule')}
        >
          <View style={styles.actionButtonsRow}>
            <ActionButton
              icon="calendar-outline"
              label="Schedule Definition Details Basic"
              onPress={() => {}}
            />
            <ActionButton
              icon="calendar-number-outline"
              label="Schedule Definition Details Roster"
              onPress={() => {}}
            />
            <ActionButton
              icon="time-outline"
              label="Schedule Seasons"
              onPress={() => {}}
            />
          </View>
          <View style={styles.actionButtonsRow}>
            <View style={styles.placeholder} />
            <ActionButton
              icon="timer-outline"
              label="Roster Schedule Timings"
              onPress={() => {}}
            />
            <ActionButton
              icon="list-outline"
              label="Schedule Work Rule Definition Details"
              onPress={() => {}}
            />
            <View style={styles.placeholder} />
          </View>
        </AccordionSection>

        <AccordionSection
          title="Bulk Updates"
          isOpen={openSection === 'bulk'}
          onToggle={() => handleToggle('bulk')}
        >
          <View style={styles.actionButtonsRow}>
            <ActionButton
              icon="swap-horizontal-outline"
              label="Schedule Roster Shift Transfer Utility"
              onPress={() => {}}
            />
            <ActionButton
              icon="create-outline"
              label="Roster Generation"
              onPress={() => {}}
            />
            <ActionButton
              icon="refresh-outline"
              label="Schedule Updater (MDH)"
              onPress={() => {}}
            />
          </View>
          <View style={styles.actionButtonsRow}>
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
            <ActionButton
              icon="albums-outline"
              label="Roster Shift Batch Entry"
              onPress={() => {}}
            />
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
          </View>
        </AccordionSection>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

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
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionContent: {},
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
  },
});
