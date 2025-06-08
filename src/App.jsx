import { useState, useEffect } from "react";
import { fetchEvents } from "./services/events";
import { fetchFirstUpcommingBirthday } from "./services/birthdays";
import './App.css';

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
        <h1>Aankomende verjaardag</h1>
        {birthdayError && <p>{birthdayError}</p>}
        {!birthdayData ? (
          <p>Geen verjaardagen meer dit jaar</p>
        ) : (
          <div className="birthday">
            <strong>{birthdayData.name}</strong> - {birthdayData.date}
          </div>
        )}
      </div>
    </>
  );
}
