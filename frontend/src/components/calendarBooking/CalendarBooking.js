import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  LocalizationProvider,
  DateCalendar,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import './CalendarBooking.css';
import { Box } from '@mui/material';


const slotsList = ['10am–2pm', '3pm–6pm', '7pm–10pm'];

const CalendarBooking = ({ clientId, clientName, onBookingSuccess }) => {
  const fetchedMonthsRef = useRef(new Set());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [ownSlots, setOwnSlots] = useState([]);
  const [calendarMap, setCalendarMap] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  const fetchBooking = async (date) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/date/${date}`);
      setBookedSlots(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setBookedSlots([]);
    }
  };

  const fetchOwnBooking = async (date) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/client/${clientId}`);
      const day = res.data.find((b) => b.date === date);
      setOwnSlots(day ? day.slots : []);
    } catch (err) {
      console.error("Error fetching client's own booking:", err);
      setOwnSlots([]);
    }
  };

  const fetchAllMonthBookings = async (year, month) => {
    const promises = [];
    for (let day = 1; day <= 31; day++) {
      const d = dayjs(`${year}-${month}-${day.toString().padStart(2, '0')}`);
      const dateStr = d.format('YYYY-MM-DD');
      if (d.isValid()) {
        promises.push(
          axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/date/${dateStr}`)
            .then((res) => ({ date: dateStr, slots: res.data }))
            .catch(() => ({ date: dateStr, slots: [] }))
        );
      }
    }

    const results = await Promise.all(promises);
    const map = {};
    results.forEach(({ date, slots }) => {
      map[date] = slots;
    });
    setCalendarMap(map);
  };

  const handleSlotToggle = async (slotLabel) => {
    const slotBooking = bookedSlots.find((s) => s.timeRange === slotLabel);
    const isMySlot = slotBooking && slotBooking.clientId === clientId;
    const isBookedByOther = slotBooking && !isMySlot;
  
    if (isBookedByOther) return;
  
    const updatedSlots = isMySlot
      ? ownSlots.filter((s) => s !== slotLabel)
      : [...ownSlots.filter((s) => s !== slotLabel), slotLabel];
  
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bookings`, {
        date: selectedDate.format('YYYY-MM-DD'),
        selectedTimeLabels: updatedSlots,
        clientId,
      });
  
      // ✅ Force fresh data from server
      await fetchBooking(selectedDate.format('YYYY-MM-DD'));
      await fetchOwnBooking(selectedDate.format('YYYY-MM-DD'));
  
      setPopupType(isMySlot ? 'cancelled' : 'success');
      setSuccessMessage(isMySlot ? '❌ Booking Cancelled!' : '✅ Booked Successfully!');
      setTimeout(() => setSuccessMessage(''), 2000);
  
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };
  
  
  

  useEffect(() => {
    if (!clientId || !selectedDate) return;
  
    const year = selectedDate.year();
    const month = (selectedDate.month() + 1).toString().padStart(2, '0');
    const dateStr = selectedDate.format('YYYY-MM-DD');
  
    const monthKey = `${year}-${month}`;
    if (!fetchedMonthsRef.current.has(monthKey)) {
      fetchedMonthsRef.current.add(monthKey);
      fetchAllMonthBookings(year, month); // this is okay if used for calendar dot coloring
    }
  
    fetchBooking(dateStr); // gets all bookings for that date with client info
    fetchOwnBooking(dateStr);
  }, [selectedDate, clientId]);
  
  const getDotColor = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const slots = calendarMap[dateStr] || [];

    const bookedCount = slots.length;
    if (bookedCount === 0) return 'green';
    if (bookedCount === 3) return 'red';
    return 'orange';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {successMessage && (
        <div className="success-popup">
          <div className={`popup-content ${popupType === 'success' ? 'popup-success' : 'popup-cancelled'}`}>
            {successMessage}
          </div>
        </div>
      )}
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <div className="calendar-container dark">
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          slotProps={{
            day: (ownerState) => {
              const color = getDotColor(ownerState.day);
              const classMap = {
                red: 'slot-dot-red',
                green: 'slot-dot-green',
                orange: 'slot-dot-orange',
              };
              return {
                className: classMap[color] || '',
                sx: { position: 'relative' },
              };
            },
          }}
        />

        <div className="slot-section dark">
          <h3>Book Slots for {selectedDate.format('DD MMM YYYY')}</h3>
          {slotsList.map((slot) => {
            const slotBooking = bookedSlots.find((s) => s.timeRange === slot);
            const isMySlot = slotBooking && slotBooking.clientId === clientId;
            const isBookedByOther = slotBooking && !isMySlot;
            const bookedClientName = isBookedByOther ? slotBooking.clientName : null;
            

            return (
              <div key={slot} className="slot-item-column">
                <div className="slot-row">
                  <span className="slot-label">
                    {slot} {isBookedByOther ? `🛑 ${bookedClientName}` : ''}
                  </span>
                  <input
  type="checkbox"
  checked={!!isMySlot}
  onChange={() => handleSlotToggle(slot)}
  disabled={isBookedByOther}
/>

                </div>

                {isMySlot && (
                  <div className="slot-booked-note">
                    Booked for <strong>{clientName}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarBooking;
