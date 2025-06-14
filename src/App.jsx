import { useState, useEffect } from "react";
import { fetchEvents } from "./services/events";
import { fetchFirstUpcommingBirthday } from "./services/birthdays";
import { getTodayKey } from "./services/birthdays";
import { putWaterIntakeByDate } from "./services/waterIntake";
import './App.css';
import { fetchWaterIntakeToday } from "./services/waterIntake";

function formatBirthdayDate(numericDate) {
  const monthNames = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];

  const [month, day] = numericDate.toString().split('.').map(Number);
  if (!month || !day) return numericDate;

  return `${day} ${monthNames[month - 1]}`;
}

function waterPercentage(liter) {
  const goal = 1.5;
  const percentage = (liter / goal) * 100;
  return Math.min(percentage, 100); // Max 100%
}

export default function App() {
  const [eventData, setEventData] = useState([]);
  const [birthdayData, setBirthdayData] = useState([]);
  const [waterIntakeData, setWaterIntakeData] = useState(0);
  const [eventError, setEventError] = useState(null);
  const [birthdayError, setBirthdayError] = useState(null);

  async function drinkWater(amount) {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const waterBefore = Math.max(0, waterIntakeData);
  const totalWater = amount + waterBefore;
  await putWaterIntakeByDate(dateStr, totalWater)
  return totalWater;
}

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

  useEffect(() => {
    fetchWaterIntakeToday()
      .then((data) => {
          console.log("Waterinname vandaag:", data);
          setWaterIntakeData(data);
      })
      .catch((err) => {
        console.error("Fout bij ophalen waterinname:", err);
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
      <br />
      <div className="event-wrapper">
        <div className="button-grid">
          <button onClick={async () => {const nieuwTotaal = await drinkWater(0.05);setWaterIntakeData(nieuwTotaal);}}>50ml</button>
          <button onClick={async () => {const nieuwTotaal = await drinkWater(0.2);setWaterIntakeData(nieuwTotaal);}}>200ml</button>
          <button onClick={async () => {const nieuwTotaal = await drinkWater(0.25);setWaterIntakeData(nieuwTotaal);}}>250ml</button>
          <button onClick={async () => {const nieuwTotaal = await drinkWater(0.5);setWaterIntakeData(nieuwTotaal);}}>500ml</button>
          <button onClick={async () => {const nieuwTotaal = await drinkWater(1);setWaterIntakeData(nieuwTotaal);}}>1l</button>
        </div>
        <br />
        {waterIntakeData >= 1.5 ? (
            <p>Je hebt je watergoal gehaald vandaag! Geen wallen voor jou!</p>
          ) : (
            <p>Je hebt nog {1.5 - waterIntakeData} liter te gaan vandaag.</p>
          )}
        <br />
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${waterPercentage(waterIntakeData)}%` }}>
            <p>{waterIntakeData} liter</p>
          </div>
        </div>
      </div>
    </>
  );
}
