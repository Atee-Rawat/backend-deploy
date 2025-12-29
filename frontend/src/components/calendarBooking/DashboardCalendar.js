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

const DashboardCalendar = () => {
  const fetchedMonthsRef = useRef(new Set());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [calendarMap, setCalendarMap] = useState({});

  const fetchBooking = async (date) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/date/${date}`);
      setBookedSlots(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setBookedSlots([]);
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

  useEffect(() => {
    if (!selectedDate) return;
  
    const year = selectedDate.year();
    const month = (selectedDate.month() + 1).toString().padStart(2, '0');
    const dateStr = selectedDate.format('YYYY-MM-DD');
  
    const monthKey = `${year}-${month}`;
    if (!fetchedMonthsRef.current.has(monthKey)) {
      fetchedMonthsRef.current.add(monthKey);
      fetchAllMonthBookings(year, month);
    }
  
    fetchBooking(dateStr);
  }, [selectedDate]);
  
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
          <h3>Bookings for {selectedDate.format('DD MMM YYYY')}</h3>
          {slotsList.map((slot) => {
            const slotBooking = bookedSlots.find((s) => s.timeRange === slot);
            const isBooked = !!slotBooking;
            const clientName = slotBooking ? slotBooking.clientName : null;

            return (
              <div key={slot} className="slot-item-column">
                <div className="slot-row">
                  <span className="slot-label">
                    {slot}
                  </span>
                  <div className="slot-status">
                    {isBooked ? (
                      <span className="booked-indicator">
                        🔒 Booked by <strong>{clientName}</strong>
                      </span>
                    ) : (
                      <span className="available-indicator">
                        ✅ Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </Box>
    </LocalizationProvider>
  );
};

export default DashboardCalendar;