import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useState, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import InputField from '../InputField';
import { vw } from '../../utils/units';
import InputDropdown from '../InputDropdown';
import CheckboxComponent from '../Checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePickerInput from '../DatePickerInput';
import FormGenerator from '../FormGenerator';

const PagerTabs = ({ tabs, tabForm, handlePopupPress, setTabForm }) => {
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleTabPress = index => {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = e => {
    setActiveTab(e.nativeEvent.position);
  };

  const handleTabFormChange = (currentField, value, pageIndex) => {
    let updatedTabForm = [...tabForm];
    const currentPage = updatedTabForm[pageIndex];
    const fieldObject = currentPage.find(
      field => field.jquerySelectorID === currentField.jquerySelectorID,
    );
    fieldObject.defaultValue = value;
    console.log(updatedTabForm, 'updatedTabForm');
    setTabForm(updatedTabForm);
  };

  return (
    <View style={styles.container}>
      {/* Tab Header */}
      <View style={styles.tabHeader}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab.displayName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, { left: `${activeTab * 33.33}%` }]} />
      </View>

      {/* PagerView Content */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {tabForm.map((formFields, pageIndex) => (
          <FormGenerator
            form={formFields}
            handlePopupPress={handlePopupPress}
            handleTabFormChange={handleTabFormChange}
            pageStyle={styles.page}
            pageIndex={pageIndex}
          />
        ))}
      </PagerView>
    </View>
  );
};

export default PagerTabs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // height: 599,
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  indicatorContainer: {
    height: 3,
    backgroundColor: '#fff',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    width: '33.33%',
    height: '100%',
    backgroundColor: '#007AFF',
    transition: 'left 0.3s ease',
  },
  pagerView: {
    height: 900,
  },
  page: {
    padding: 20,
    backgroundColor: '#f8f8f8ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  pageText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
});
