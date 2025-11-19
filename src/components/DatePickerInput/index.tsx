import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import InputField from '../InputField';
import { vw } from '../../utils/units';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const DatePickerInput = ({ field, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      onChange(moment(selectedDate).format('YYYY-MM-DD'));
    }
  };
  return (
    <View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      <InputField
        label={field.displayName}
        placeholder={field.placeholder}
        value={field?.defaultValue}
        inputStyle={{ width: vw * 42 }}
        onPress={() => setShowDatePicker(true)}
        // Add other props as needed based on your field structure
      />
    </View>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({});
