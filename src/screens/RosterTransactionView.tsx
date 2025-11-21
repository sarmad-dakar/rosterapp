import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getDynamicForm } from '../api/rosterSchedule';
import FormProcessor from '../components/FormProcessor';
import axios from 'axios';

const EmployeeCareerScreen = ({ route }) => {
  const styles = MyStyles();
  const employeeCode = route?.params?.employeeCode;
  const [dynamicFormData, setDynamicFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const cancelTokenSource = axios.CancelToken.source();

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
    return () => {
      cancelTokenSource.cancel('Operation canceled on unmount.');
    };
  }, [employeeCode]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 4000);

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
      const response = await getDynamicForm(data, cancelTokenSource);
      console.log('Dynamic form data fetched successfully:', response.data);
      setDynamicFormData(response?.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching dynamic form data:', error);
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async formData => {
    try {
      console.log('Form submission started with data:', formData);

      // Call your API here to submit the form
      // const response = await submitDynamicForm(formData);

      // Example API call structure:
      /*
      const submitData = {
        FormName: 'EmployeeCareer',
        Operation: 'update',
        Parameters: formData,
      };
      const response = await submitDynamicForm(submitData);
      */

      // Show success message
      console.log('Form submitted successfully');

      // Optionally refresh data
      // await fetchDynamicForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message to user
      throw error;
    }
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

  if (!dynamicFormData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FormProcessor
        dynamicFormData={dynamicFormData}
        handleSubmit={handleFormSubmit}
        employeeCode={employeeCode}
      />
    </View>
  );
};

export default EmployeeCareerScreen;

const MyStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
    errorText: {
      fontSize: 16,
      color: '#ef4444',
      fontWeight: '500',
    },
  });
  return styles;
};
