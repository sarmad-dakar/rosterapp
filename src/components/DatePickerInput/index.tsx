import {
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import InputField from '../InputField';
import { vw } from '../../utils/units';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { icons } from '../../assets';

const DatePickerInput = ({ field, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        setDate(selectedDate);
        onChange(moment(selectedDate).format('YYYY-MM-DD'));
      }
    } else {
      // iOS: update temp date while scrolling
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    setDate(tempDate);
    onChange(moment(tempDate).format('YYYY-MM-DD'));
    setShowDatePicker(false);
  };

  const handleCancel = () => {
    setTempDate(date);
    setShowDatePicker(false);
  };

  return (
    <View>
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )
      )}

      <InputField
        label={field.displayName}
        placeholder={field.placeholder}
        value={moment(date).format('YYYY-MM-DD')}
        inputStyle={{ width: vw * 42 }}
        onPress={() => setShowDatePicker(true)}
        editable={false}
        rightIcon={icons.calendar}
      />
    </View>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  confirmButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
});
