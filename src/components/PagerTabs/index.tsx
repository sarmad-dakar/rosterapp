import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import InputField from '../InputField';
import { vw } from '../../utils/units';
import InputDropdown from '../InputDropdown';

const PagerTabs = ({ tabs, tabForm }) => {
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef(null);

  const handleTabPress = index => {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = e => {
    setActiveTab(e.nativeEvent.position);
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
          <View key={pageIndex} style={styles.page}>
            {formFields.map((field, fieldIndex) => {
              if (field.fieldType === 'emptydiv') {
                return <View key={fieldIndex} style={{ width: vw * 45 }} />;
              }
              if (field.fieldType === 'selectdropdown') {
                return (
                  <InputDropdown
                    key={fieldIndex}
                    label={field.displayName}
                    placeholder={field.placeholder}
                    inputStyle={{ width: vw * 42 }}
                  />
                );
              } else {
                return (
                  <InputField
                    key={fieldIndex}
                    label={field.displayName}
                    placeholder={field.placeholder}
                    inputStyle={{ width: vw * 42 }}

                    // Add other props as needed based on your field structure
                  />
                );
              }
            })}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

export default PagerTabs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
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
    backgroundColor: '#f5f5f5',
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
