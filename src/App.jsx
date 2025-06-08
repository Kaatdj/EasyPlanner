import { useState, useEffect } from "react";
import { fetchEvents } from "./services/events";
import { fetchFirstUpcommingBirthday } from "./services/birthdays";
import { getTodayKey } from "./services/birthdays";
import './App.css';

function formatBirthdayDate(numericDate) {
  const monthNames = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];

  const [month, day] = numericDate.toString().split('.').map(Number);
  if (!month || !day) return numericDate;

  return `${day} ${monthNames[month - 1]}`;
}

export default function App() {
  const [eventData, setEventData] = useState([]);
  const [birthdayData, setBirthdayData] = useState([]);
  const [eventError, setEventError] = useState(null);
  const [birthdayError, setBirthdayError] = useState(null);

  // Haal events op na eerste load
  useEffect(() => {
    fetchEvents()
      .then(setEventData)
      .catch((err) => {
        console.error(err);
        setEventError("Er is iets misgegaan bij het ophalen van de events.");
      });
  }, []);

  // Haal verjaardagen op na eerste load
  useEffect(() => {
    fetchFirstUpcommingBirthday()
      .then(setBirthdayData)
      .catch((err) => {
        console.error(err);
        setBirthdayError("Er is iets misgegaan bij het ophalen van de verjaardagen.");
      });
  }, []);

  return (
    <>
      <div className="event-wrapper">
        <h1>Jouw volgende eventen</h1>
        {eventError && <p>{eventError}</p>}
        <ul>
          {eventData.length === 0 ? (
            <li>U are Free!</li>
          ) : (
            eventData.map((event, i) => (
              <li className="grid" key={i}>
                <div className="event">
                  <strong>Examen:</strong> {event.name} <br />
                  <strong>Datum:</strong> {event.date?.toDate().toLocaleString() || "Geen datum beschikbaar"}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <br />
      <div className="event-wrapper">
        {birthdayData && birthdayData.date &&
          (parseInt(getTodayKey().split(".")[0], 10) === parseInt(birthdayData.date.toString().split(".")[0], 10) &&
           parseInt(getTodayKey().split(".")[1], 10) === parseInt(birthdayData.date.toString().split(".")[1], 10)
          ) ? (
            <h1>{birthdayData.name} is jarig</h1>
          ) : (
            <h1>Aankomende verjaardag</h1>
          )
        }
        {birthdayError && <p>{birthdayError}</p>}
        {birthdayData && birthdayData.date ? (
          <div className="birthday">
            <strong>{birthdayData.name}</strong> - {formatBirthdayDate(birthdayData.date)}
          </div>
        ) : (
          <p>Geen verjaardagen meer dit jaar</p>
        )}
      </div>
    </>
  );
}
