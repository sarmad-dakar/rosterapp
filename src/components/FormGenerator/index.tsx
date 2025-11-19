import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { vw } from '../../utils/units';
import InputDropdown from '../InputDropdown';
import DatePickerInput from '../DatePickerInput';
import InputField from '../InputField';
import CheckboxComponent from '../Checkbox';

const FormGenerator = ({
  form,
  handlePopupPress,
  handleTabFormChange,
  pageIndex,
  pageStyle,
}) => {
  return (
    <View style={pageStyle}>
      {form.map((field, fieldIndex) => {
        if (field.fieldType === 'emptydiv') {
          return <View key={fieldIndex} style={{ width: vw * 45 }} />;
        }
        if (field.fieldType === 'selectdropdown') {
          return (
            <InputDropdown
              key={fieldIndex}
              label={field.displayName}
              placeholder={field.placeholder}
              inputStyle={{ width: field?.layoutClass == 6 ? vw * 42 : '100%' }}
              dropdownData={field.fieldData}
              value={field.defaultValue?.description}
              dropdown={true}
              onChange={item => handleTabFormChange(field, item, pageIndex)}
            />
          );
        }
        if (field.fieldType === 'modal' || field.fieldType === 'modalinput') {
          return (
            <InputDropdown
              key={fieldIndex}
              label={field.displayName}
              placeholder={field.placeholder}
              inputStyle={{ width: field?.layoutClass == 6 ? vw * 42 : '100%' }}
              value={field.defaultValue?.description}
              ismodal={true}
              onPress={() =>
                handlePopupPress(field.fieldData, field, pageIndex)
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
                handleTabFormChange(field, value, pageIndex)
              }
            />
          );
        }
        if (field?.fieldType === 'datepickersingle') {
          return (
            <DatePickerInput
              field={field}
              inputStyle={{ width: field?.layoutClass == 6 ? vw * 42 : '100%' }}
              onChange={value => {
                console.log(value, 'datevalue');
                handleTabFormChange(field, value, pageIndex);
              }}
              // Add other props as needed based on your field structure
            />
          );
        } else {
          return (
            <InputField
              key={fieldIndex}
              label={field.displayName}
              placeholder={field.placeholder}
              value={field?.defaultValue}
              inputStyle={{ width: field?.layoutClass == 6 ? vw * 42 : '100%' }}

              // Add other props as needed based on your field structure
            />
          );
        }
      })}
    </View>
  );
};

export default FormGenerator;

const styles = StyleSheet.create({});
