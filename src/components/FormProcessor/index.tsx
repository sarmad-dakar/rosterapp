import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { vw } from '../../utils/units';
import InputDropdown from '../InputDropdown';
import DatePickerInput from '../DatePickerInput';
import InputField from '../InputField';
import CheckboxComponent from '../Checkbox';
import PopupWrapper from '../PopupWrapper';
import TableViewModal from '../TableViewModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormProcessorProps {
  dynamicFormData: any;
  handleSubmit: (formData: any) => Promise<void>;
  employeeCode?: string;
}

const FormProcessor: React.FC<FormProcessorProps> = ({
  dynamicFormData,
  handleSubmit,
  employeeCode,
}) => {
  const styles = MyStyles();
  const [tabs, setTabs] = useState([]);
  const [tabForm, setTabForm] = useState([]);
  const [generalForm, setGeneralForm] = useState([]);
  const [headerForm, setHeaderForm] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [currentActiveField, setCurrentActiveField] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const insets = useSafeAreaInsets();

  const popupRef = useRef<any>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (dynamicFormData) {
      sortAndProcessData(dynamicFormData);
    }
  }, [dynamicFormData]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeTab,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
  }, [activeTab]);

  const sortAndProcessData = data => {
    if (data.tabs) {
      const sortedTabs = data.tabs.sort((a, b) => a.tabId - b.tabId);
      let tabArray = [];

      for (let i = 0; i < sortedTabs.length; i++) {
        const fieldData = data.dynamicFields.filter(
          item => item.parentTabID === i + 1,
        );
        tabArray.push(
          fieldData.sort((a, b) => a.displaySeqNo - b.displaySeqNo),
        );
      }

      const generalFields = data.dynamicFields.filter(
        item => item.parentTabID === 0 && !item.isHeader,
      );

      const headerFields = data.dynamicFields.filter(item => item.isHeader);

      setHeaderForm(headerFields);
      setGeneralForm(
        generalFields.sort((a, b) => a.displaySeqNo - b.displaySeqNo),
      );
      setTabs(sortedTabs);
      setTabForm(tabArray);
    }
  };

  const handlePopupPress = (fieldData, currentField, pageIndex) => {
    if (popupRef && popupRef.current) {
      popupRef.current.show();
      setTableData(fieldData);
      setCurrentPageIndex(pageIndex);
      setCurrentActiveField(currentField);
    }
  };

  const handleTableSelection = selectedItems => {
    const currentItems = selectedItems[0];

    if (currentPageIndex === 'general') {
      let updatedGeneralForm = [...generalForm];
      const fieldObject = updatedGeneralForm.find(
        field => field.jquerySelectorID === currentActiveField.jquerySelectorID,
      );
      if (fieldObject) {
        fieldObject.defaultValue = currentItems;
      }
      setGeneralForm(updatedGeneralForm);
    } else {
      let updatedTabForm = [...tabForm];
      const currentPage = updatedTabForm[currentPageIndex];
      const fieldObject = currentPage.find(
        field => field.jquerySelectorID === currentActiveField.jquerySelectorID,
      );
      if (fieldObject) {
        fieldObject.defaultValue = currentItems;
      }
      setTabForm(updatedTabForm);
    }

    popupRef.current.hide();
  };

  const handleGeneralFormChange = (currentField, value) => {
    let updatedGeneralForm = [...generalForm];
    const fieldObject = updatedGeneralForm.find(
      field => field.jquerySelectorID === currentField.jquerySelectorID,
    );
    if (fieldObject) {
      fieldObject.defaultValue = value;
    }
    setGeneralForm(updatedGeneralForm);
  };

  const handleTabFormChange = (currentField, value, pageIndex) => {
    let updatedTabForm = [...tabForm];
    const currentPage = updatedTabForm[pageIndex];
    const fieldObject = currentPage.find(
      field => field.jquerySelectorID === currentField.jquerySelectorID,
    );
    if (fieldObject) {
      fieldObject.defaultValue = value;
    }
    setTabForm(updatedTabForm);
  };

  const collectFormData = () => {
    const formData: any = {};

    if (employeeCode) {
      formData.employeeCode = employeeCode;
    }

    // Collect general form data
    generalForm.forEach(field => {
      if (field.isPost && field.jsonDataKeyName) {
        let value = field.defaultValue;

        if (
          field.fieldType === 'modal' ||
          field.fieldType === 'selectdropdown'
        ) {
          value = field.defaultValue?.code || '';
        } else if (field.fieldType === 'checkbox') {
          value = field.defaultValue || false;
        } else if (field.fieldType === 'datepickersingle') {
          value = field.defaultValue || '';
        }

        formData[field.jsonDataKeyName] = value;
      }
    });

    // Collect tab form data
    tabForm.forEach(tab => {
      tab.forEach(field => {
        if (field.isPost && field.jsonDataKeyName) {
          let value = field.defaultValue;

          if (
            field.fieldType === 'modal' ||
            field.fieldType === 'selectdropdown'
          ) {
            value = field.defaultValue?.code || '';
          } else if (field.fieldType === 'checkbox') {
            value = field.defaultValue || false;
          } else if (field.fieldType === 'datepickersingle') {
            value = field.defaultValue || '';
          }

          formData[field.jsonDataKeyName] = value;
        }
      });
    });

    return formData;
  };

  const showSuccessAnimation = () => {
    setSaveSuccess(true);
    Animated.sequence([
      Animated.spring(successAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.delay(2000),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setSaveSuccess(false));
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const formData = collectFormData();
      console.log('Submitting form data:', formData);
      await handleSubmit(formData);
      setIsSaving(false);
      showSuccessAnimation();
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSaving(false);
    }
  };

  const handleTabPress = index => {
    setActiveTab(index);
  };

  const getFieldWidth = layoutClass => {
    if (layoutClass === 12) return '100%';
    if (layoutClass === 6) return vw * 42;
    if (layoutClass === 4) return vw * 28;
    if (layoutClass === 3) return vw * 21;
    return vw * 42;
  };

  const renderField = (field, fieldIndex, pageIndex, isGeneral = false) => {
    const fieldWidth = getFieldWidth(field.layoutClass);

    if (field.fieldType === 'emptydiv') {
      return <View key={fieldIndex} style={{ width: fieldWidth }} />;
    }

    if (field.fieldType === 'selectdropdown') {
      return (
        <InputDropdown
          key={fieldIndex}
          label={field.displayName}
          placeholder={field.placeholder}
          inputStyle={{ width: fieldWidth }}
          dropdownData={field.fieldData}
          value={field.defaultValue?.description}
          dropdown={true}
          onChange={item =>
            isGeneral
              ? handleGeneralFormChange(field, item)
              : handleTabFormChange(field, item, pageIndex)
          }
        />
      );
    }

    if (field.fieldType === 'modal' || field.fieldType === 'modalinput') {
      return (
        <InputDropdown
          key={fieldIndex}
          label={field.displayName}
          placeholder={field.placeholder}
          inputStyle={{ width: fieldWidth }}
          value={field.defaultValue?.description}
          ismodal={true}
          dropdown={false}
          onPress={() =>
            field.fieldData?.length > 0 &&
            handlePopupPress(
              field.fieldData,
              field,
              isGeneral ? 'general' : pageIndex,
            )
          }
        />
      );
    }

    if (field.fieldType === 'checkbox') {
      return (
        <CheckboxComponent
          key={fieldIndex}
          label={field.displayName}
          value={field.defaultValue}
          onValueChange={value =>
            isGeneral
              ? handleGeneralFormChange(field, value)
              : handleTabFormChange(field, value, pageIndex)
          }
        />
      );
    }

    if (field.fieldType === 'datepickersingle') {
      return (
        <DatePickerInput
          key={fieldIndex}
          field={field}
          inputStyle={{ width: fieldWidth }}
          onChange={value =>
            isGeneral
              ? handleGeneralFormChange(field, value)
              : handleTabFormChange(field, value, pageIndex)
          }
        />
      );
    }

    return (
      <InputField
        key={fieldIndex}
        label={field.displayName}
        placeholder={field.placeholder}
        value={field?.defaultValue}
        inputStyle={{ width: fieldWidth }}
        editable={!field.isReadOnly}
        onChangeText={value =>
          isGeneral
            ? handleGeneralFormChange(field, value)
            : handleTabFormChange(field, value, pageIndex)
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        {/* Header Form */}
        {headerForm.length > 0 && (
          <View style={styles.headerFormContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLine} />
              <Text style={styles.cardHeaderText}>Basic Information</Text>
            </View>
            {headerForm.map((field, index) =>
              renderField(field, index, 0, true),
            )}
          </View>
        )}

        {/* General Form */}
        {generalForm.length > 0 && (
          <View style={styles.generalFormContainer}>
            {generalForm.map((field, index) =>
              renderField(field, index, 0, true),
            )}
          </View>
        )}
        {/* Tab Pills */}
        {tabs.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabHeader}
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.tabPill, isActive && styles.tabPillActive]}
                  onPress={() => handleTabPress(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabPillText,
                      isActive && styles.tabPillTextActive,
                    ]}
                  >
                    {tab.displayName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}
        {/* Modern Tabs */}
        {tabs.length > 0 && (
          <View style={styles.tabsContainer}>
            {/* Tab Content with Fade Animation */}
            {tabForm.map((formFields, pageIndex) =>
              activeTab === pageIndex ? (
                <Animated.View
                  key={pageIndex}
                  style={[
                    styles.tabContentContainer,
                    {
                      opacity: slideAnim.interpolate({
                        inputRange: [
                          pageIndex - 0.5,
                          pageIndex,
                          pageIndex + 0.5,
                        ],
                        outputRange: [0, 1, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                >
                  <View style={styles.page}>
                    {formFields.map((field, fieldIndex) =>
                      renderField(field, fieldIndex, pageIndex, false),
                    )}
                  </View>
                </Animated.View>
              ) : null,
            )}
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveChanges}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          {isSaving ? (
            <View style={styles.saveButtonContent}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={[styles.saveButtonText, { marginLeft: 10 }]}>
                Saving...
              </Text>
            </View>
          ) : (
            <View style={styles.saveButtonContent}>
              <View style={styles.saveIcon}>
                <Text style={styles.saveIconText}>✓</Text>
              </View>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Success Toast */}
      {saveSuccess && (
        <Animated.View
          style={[
            styles.successToast,
            {
              opacity: successAnim,
              transform: [
                {
                  translateY: successAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
                {
                  scale: successAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1.05, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successText}>Changes saved successfully!</Text>
        </Animated.View>
      )}

      {/* Popup Modal */}
      <PopupWrapper ref={popupRef}>
        <TableViewModal
          onChange={item => handleTableSelection(item)}
          tableData={tableData}
        />
      </PopupWrapper>
    </View>
  );
};

export default FormProcessor;

const MyStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    headerFormContainer: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
    },
    generalFormContainer: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    tabsContainer: {
      backgroundColor: '#FFFFFF',
      marginBottom: 12,
    },
    tabHeader: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: '#F8FAFC',
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    tabPill: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 10,
      backgroundColor: '#FFFFFF',
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    tabPillActive: {
      backgroundColor: '#0d4483',
      borderColor: '#0d4483',
      boxShadow: '0px 4px 8px rgba(59, 130, 246, 0.3)',
    },
    tabPillText: {
      fontSize: 14,
      color: '#64748B',
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    tabPillTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    tabContentContainer: {
      backgroundColor: '#FFFFFF',
    },
    page: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      minHeight: 200,
    },
    saveButton: {
      backgroundColor: '#0d4483',
      margin: 20,
      marginTop: 8,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      ...Platform.select({
        ios: {
          shadowColor: '#0d4483',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    saveButtonDisabled: {
      backgroundColor: '#94A3B8',
      ...Platform.select({
        ios: {
          shadowColor: '#94A3B8',
          shadowOpacity: 0.2,
        },
      }),
    },
    saveButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    saveIconText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    successToast: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      backgroundColor: '#10B981',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#10B981',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    successIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    successIconText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    successText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: 0.3,
      flex: 1,
    },
    cardHeader: {
      paddingTop: 20,
      paddingBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    cardHeaderLine: {
      width: 4,
      height: 20,
      backgroundColor: '#0d4483',
      borderRadius: 2,
      marginRight: 12,
    },
    cardHeaderText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1F2937',
      letterSpacing: 0.3,
    },
  });
  return styles;
};
