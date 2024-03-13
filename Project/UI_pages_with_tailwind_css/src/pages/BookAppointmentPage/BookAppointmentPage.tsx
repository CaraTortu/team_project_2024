import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { format, startOfWeek, addDays, isBefore, isToday } from 'date-fns';

const doctors = [
  { id: 1, name: 'Dr. Jane Smith' },
  { id: 2, name: 'Dr. Shiv Sharma' },
  { id: 3, name: 'Dr. John Doe' },
];

type AppointmentSlot = {
  id: string;
  doctor: string;
  time: string;
  date: Date;
  booked: boolean;
};

// Defining function to generate slots, just for testing, will use server data in real app
const generateTimeSlots = (date: Date): AppointmentSlot[] => {
  let slots: AppointmentSlot[] = [];
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  for (let hour = 9; hour < 14; hour++) { // 9 AM to 2 PM, ends at 13:45
    for (let minutes = 0; minutes < 60; minutes += 15) {
      date.setHours(hour, minutes);
      doctors.forEach(doctor => {

        //Slot is an object with id, doctor, time, date, and booked properties, we will need to use this data on in database to crete appointments
        slots.push({
          id: `${doctor.id}-${date.getTime()}`,
          doctor: doctor.name,
          time: format(date, 'HH:mm'),
          date: new Date(date),
          booked: Math.random() < 0.3 // Randomly mark some slots as booked
        });
      });
    }
  }
  return slots;
};

// Generate the slots once, outside of the component
const TimeSlots = generateTimeSlots(new Date());

const BookAppointmentPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<AppointmentSlot[]>(TimeSlots);

  useEffect(() => {
    // Creat an array for the weekdays (Monday to Friday)
    const days: Date[] = [];
    for (let i = 0; i < 5; i++) { // Loop for 5 weekdays
      days.push(addDays(selectedDate, i));
    }
    setWeekDays(days);
    
    // regenerates time slots whenever the selectedDate changes.
    setTimeSlots(generateTimeSlots(selectedDate));
   
  }, [selectedDate]);

  // Function to select a time slot
  const selectTimeSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
  };



  // Navigation functions for week
  const goToPreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const goToNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

    // Function to confirm the booking
  const confirmBooking = () => {
    if (!selectedSlotId|| !selectedDate) return;
    let bookingData;
    // Find the selected time slot to get all its details for database
    const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);
    
    if (selectedSlot) {
        // Prepare the booking data
        const bookingData = {
          slotId: selectedSlot.id,
          doctor: selectedSlot.doctor,
          time: selectedSlot.time,
          date: selectedSlot.date,
        };
        console.log('Booking data:', bookingData);
    }

    console.log('Booking id:', selectedSlotId);
    

    // Update the timeSlots array. Set 'booked' to true for the selected slot.
    const updatedTimeSlots = timeSlots.map(slot => {
        if (slot.id === selectedSlotId) {
            bookingData = {
                slotId: slot.id,
                doctor: slot.doctor,
                time: slot.time,
                date: slot.date,
            };
            return { ...slot, booked: true };
        }
        return slot;
    });

    setTimeSlots(updatedTimeSlots); // Update the state with the new slots array.
    
    // Clear the selected slot and provide any further confirmation needed.
    setSelectedSlotId(null);

    // Here you would also typically send a confirmation to the backend.
    alert('Appointment booked successfully!');
  };

  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-4 ml-64">
        <h1 className="text-xl font-bold mb-4">Book an Appointment</h1>
        <div className="flex justify-between items-center mb-4">
          <button onClick={goToPreviousWeek} className="px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded-lg">Previous Week</button>
        {weekDays.map((day) => (
            <button
                key={day.getTime()} 
                disabled={isBefore(day, new Date()) && !isToday(day)}
                onClick={() => setSelectedDate(day)}
                className={`px-4 py-2 mx-1 ${
                    isBefore(day, new Date()) && !isToday(day) ? 'bg-gray-300 cursor-not-allowed' : 
                    selectedDate.toDateString() === day.toDateString() ? 'bg-blue-500 text-white' : 'bg-blue-200 hover:bg-blue-300'
                }`}
            >
                {format(day, 'EEE dd MMM')}
            </button>
        ))}
          <button onClick={goToNextWeek} className="px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded-lg">Next Week</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
            {timeSlots.map(slot => {
                const slotClassName = getSlotClassName(slot);

                const handleClick = () => {
                    if (!slot.booked) {
                        selectTimeSlot(slot.id);
                    }
                };

                function getSlotClassName(slot: AppointmentSlot): string {
                    if (slot.id === selectedSlotId) {
                        return 'bg-blue-300';
                    } else if (slot.booked) {
                        return 'bg-red-300 cursor-not-allowed';
                    } else {
                        return 'bg-green-200 hover:bg-green-300';
                    }
                }

                return (
                    <button
                        key={slot.id}
                        className={`p-2 text-left rounded-lg border ${slotClassName}`}
                        onClick={handleClick}
                        disabled={slot.booked}
                    >
                        {slot.time} - {slot.doctor} {slot.booked ? '(Booked)' : ''}
                    </button>
                );
            })}
        </div>
        {selectedSlotId && (
        <button
          onClick={confirmBooking}
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-blue-500 text-white rounded-md mb-4"
          style={{ zIndex: 1000 }}
        >
          Select This Appointment
        </button>
      )}
    </div>
    </div>
  );
};

export default BookAppointmentPage;
