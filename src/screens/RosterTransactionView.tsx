import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InputField from '../components/InputField';
import PagerTabs from '../components/PagerTabs';
import { dynamicJson } from '../utils/dummyJson';
import MyCustomButton from '../components/button';
import PopupWrapper from '../components/PopupWrapper';
import TableViewModal from '../components/TableViewModal';

const ComponentName = () => {
  const styles = MyStyles();
  const [tabs, setTabs] = useState([]);
  const [tabForm, setTabForm] = useState([]);
  const [generalForm, setGeneralForm] = useState([]);
  const [tableData, setTableData] = useState([]);
  const popupRef = React.useRef<any>(null);

  useEffect(() => {
    sortJson();
  }, []);

  const sortJson = () => {
    const response = dynamicJson;
    if (response.tabs) {
      const sortedTabs = response.tabs.sort((a, b) => a.tabId - b.tabId);
      let tabArray = [];

      for (let i = 0; i < sortedTabs.length; i++) {
        const fieldData = response.dynamicFields.filter(
          item => item.parentTabID === i + 1,
        );

        tabArray.push(
          fieldData.sort((a, b) => a.displaySeqNo - b.displaySeqNo),
        );
      }
      const generalFields = response.dynamicFields.filter(
        item => item.parentTabID === 0,
      );
      setGeneralForm(
        generalFields.sort((a, b) => a.displaySeqNo - b.displaySeqNo),
      );
      console.log(generalFields, 'generalFields');
      setTabs(sortedTabs);
      console.log(tabArray, 'sortedTabs');
      console.log(response.pageTableModals, 'Modals');
      setTabForm(tabArray);
    }
  };

  const handlePopupPress = fieldData => {
    if (popupRef && popupRef.current) {
      popupRef.current.show();
      setTableData(fieldData);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{}}>
        <Text>Tabs View</Text>
        {generalForm.map(item => {
          if (item.fieldType !== 'emptydiv') {
            return (
              <InputField
                key={item.fieldID}
                label={item.displayName}
                placeholder={item.placeholder}
                value={item.defaultValue}
              />
            );
          }
        })}
        <PagerTabs
          handlePopupPress={handlePopupPress}
          tabs={tabs}
          tabForm={tabForm}
        />
        <PopupWrapper ref={popupRef}>
          <TableViewModal tableData={tableData} />
        </PopupWrapper>
        {/* <InputField label="Username" placeholder="Enter your username" /> */}
      </ScrollView>
    </View>
  );
};

export default ComponentName;

const MyStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
  return styles;
};
