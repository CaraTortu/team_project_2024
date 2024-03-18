// src/components/WeekCalendar/WeekCalendar.tsx
import React, { useState, useEffect } from 'react';
import './WeekCalendar.css';

const WeekCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const current = new Date();
    const week = [];

    for (let i = 1; i <= 7; i++) {
      const first = current.getDate() - current.getDay() + i;
      const day = new Date(current.setDate(first)).toISOString().slice(0, 10);
      week.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day).getDay()],
        date: day,
        isSelected: i === current.getDay(),
      });
    }

    setWeekDates(week);
  }, []);

  const selectDate = (day) => {
    setSelectedDate(new Date(day.date));
    setWeekDates(weekDates.map(d => ({ ...d, isSelected: d.date === day.date })));
    // This is where you would also load the appointments for the selected date
  };

  return (
    <div className="week-calendar">
      <div className="week-header">
        {weekDates.map((day) => (
          <div key={day.date} className={`day ${day.isSelected ? 'selected' : ''}`}
               onClick={() => selectDate(day)}>
            <div className="day-name">{day.day}</div>
            <div className="day-number">{new Date(day.date).getDate()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
