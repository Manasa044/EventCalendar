import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isBefore, startOfDay} from "date-fns";
import "./CalendarPage.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      date: "2025-11-08",
      startTime: "00:00",
      endTime: "01:30",
      color: "#f6be23",
      title: "Daily Standup",
    },
    {
      date: "2025-11-09",
      startTime: "04:30",
      endTime: "07:30",
      color: "#f6501e",
      title: "Weekly Catchup",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    color: "#1faddc",
  });

  // 🕒 Automatically remove events whose end time has passed
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      setEvents((prevEvents) =>
        prevEvents.filter((event) => {
          const eventEnd = new Date(`${event.date}T${event.endTime}`);
          return eventEnd > now; // keep only future or ongoing events
        })
      );
    }, 60000); // runs every 60 seconds

    return () => clearInterval(timer);
  }, []);

  const handleAddEvent = () => {
    const selectedDate = new Date(newEvent.date);
    const today = startOfDay(new Date());

    if (isBefore(selectedDate, today)) {
      alert("You cannot add an event to a past date!");
      return;
    }

    if (!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime) {
      alert("Please fill all the fields!");
      return;
    }

    setEvents([...events, newEvent]);
    setNewEvent({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      color: "#1faddc",
    });
    setShowModal(false);
  };

  const getEventsForDate = (date) =>
    events.filter((e) => e.date === format(date, "yyyy-MM-dd"));

  return (
    <div className="calendar-fullscreen">
      <header className="calendar-header">
        <h1 className="logo-name" style={{ color: "#1faddcff" }}>
          Survey Sparrow Calendar
        </h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Event
        </button>
      </header>

      <main className="calendar-wrapper">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={({ date }) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div className="event-list">
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="event-item"
                    style={{ backgroundColor: event.color }}
                  >
                    <strong>{event.title}</strong>
                    <div style={{ fontSize: "12px" }}>
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
          className="custom-calendar"
        />
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add New Event</h2>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
            />
            <input
              type="time"
              value={newEvent.startTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startTime: e.target.value })
              }
            />
            <input
              type="time"
              value={newEvent.endTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endTime: e.target.value })
              }
            />
            <input
              type="color"
              value={newEvent.color}
              onChange={(e) =>
                setNewEvent({ ...newEvent, color: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddEvent}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;