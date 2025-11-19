import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import InputField from '../components/InputField';
import PagerTabs from '../components/PagerTabs';
import { dynamicJson } from '../utils/dummyJson';
import MyCustomButton from '../components/button';
import PopupWrapper from '../components/PopupWrapper';
import TableViewModal from '../components/TableViewModal';
import { getDynamicForm } from '../api/rosterSchedule';
import InputDropdown from '../components/InputDropdown';
import { vw } from '../utils/units';
import FormGenerator from '../components/FormGenerator';

const ComponentName = ({ route }) => {
  const styles = MyStyles();
  const employeeCode = route?.params?.employeeCode;
  const [tabs, setTabs] = useState([]);
  const [tabForm, setTabForm] = useState([]);
  const [generalForm, setGeneralForm] = useState([]);
  const [tableData, setTableData] = useState([]);
  const popupRef = React.useRef<any>(null);
  const [currentActiveField, setCurrentActiveField] = useState(null);
  const [curreentPageIndex, setCurrentPageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    'Fetching data...',
    'Gathering information...',
    'Almost there...',
    'Thanks for your patience...',
  ];

  useEffect(() => {
    if (employeeCode) {
      console.log('Fetching data for employee code:', employeeCode);
      fetchDynamicForm();
    }
  }, [employeeCode]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 4000); // Change message every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const fetchDynamicForm = async () => {
    try {
      setIsLoading(true);
      let data = {
        FormName: 'EmployeeCareer',
        Operation: 'read',
        Parameters: {
          EmployeeCode: employeeCode,
          SeqNo: '',
          EffectiveDate: '',
        },
      };
      console.log('Request data for dynamic form:', data);
      const response = await getDynamicForm(data);
      console.log('Dynamic form data fetched successfully:', response.data);
      sortJson(response?.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching dynamic form data:', error);
      setIsLoading(false);
    }
  };

  const sortJson = dynamicData => {
    const response = dynamicData;
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

  const handlePopupPress = (fieldData, currentField, pageIndex) => {
    if (popupRef && popupRef.current) {
      popupRef.current.show();
      setTableData(fieldData);
      setCurrentPageIndex(pageIndex);
      console.log(currentField, 'currentField');
      setCurrentActiveField(currentField);
    }
  };

  const handleTableSelection = selectedItems => {
    const currentItems = selectedItems[0];
    let updatedTabForm = [...tabForm];

    console.log(currentItems, 'currentItems');
    console.log(curreentPageIndex, 'curreentPageIndex');
    console.log(currentActiveField, 'currentActiveField');
    const currentPage = updatedTabForm[curreentPageIndex];
    const fieldObject = currentPage.find(
      field => field.jquerySelectorID === currentActiveField.jquerySelectorID,
    );
    fieldObject.defaultValue = currentItems;
    console.log(updatedTabForm, 'updatedTabForm');
    setTabForm(updatedTabForm);
    popupRef.current.hide();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          {loadingMessages[loadingMessageIndex]}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{}}>
        <FormGenerator
          form={generalForm}
          handlePopupPress={value => console.log(value, 'popupPress')}
          pageIndex={0}
          handleTabFormChange={value => console.log(value, 'tab formChange ')}
        />
        <PagerTabs
          handlePopupPress={handlePopupPress}
          tabs={tabs}
          tabForm={tabForm}
          setTabForm={setTabForm}
        />
        <PopupWrapper ref={popupRef}>
          <TableViewModal
            onChange={item => handleTableSelection(item)}
            tableData={tableData}
          />
        </PopupWrapper>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#666',
      fontWeight: '500',
    },
  });
  return styles;
};
