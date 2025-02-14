import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { enGB } from 'date-fns/locale'; // Locale for formatting

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

const CustomDateTimePicker: React.FC<Props> = ({ value, onChange }) => {
  // Format the date to 'HH:mm dd.MM.yyyy'
  const formatDisplay = (date: Date) => 
    format(date, 'HH:mm dd.MM.yyyy', { locale: enGB });

  return (
    <DatePicker
      selected={value}
      onChange={(date: Date) => onChange(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15} // Interval for time selection
      dateFormat="HH:mm dd.MM.yyyy"
      className="w-full p-2 border rounded-lg"
      placeholderText="00:00 01.01.0001"
      // Use custom input to display the formatted date
      customInput={
        <input
          type="text"
          value={formatDisplay(value)}
          className="w-full p-2 border rounded-lg"
        />
      }
    />
  );
};

export default CustomDateTimePicker;
