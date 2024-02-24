import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ onSelect, unavailableDates }) => {
    const [dates, setDates] = useState([null, null]);

    useEffect(() => {
        if (dates[0] && unavailableDates.some(unavailableDate =>
            dates[0].getTime() === unavailableDate.getTime())) {
            setDates([null, null]);
        }
    }, [dates, unavailableDates]);

    const onChange = (dates) => {
        const [start, end] = dates;
        setDates([start, end]);
        if (start && end) {
            onSelect(start, end);
        }
    };

    const isDateSelectable = (date) => {
        return !unavailableDates.some(unavailableDate =>
            date.getTime() === unavailableDate.getTime());
    };

    return (
        <DatePicker
            selectsRange
            startDate={dates[0]}
            endDate={dates[1]}
            onChange={onChange}
            inline
            highlightDates={unavailableDates}
            excludeDates={unavailableDates}
            filterDate={isDateSelectable}
        />
    );
};

export default Calendar;

