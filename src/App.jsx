import { useState, useEffect } from "react";
import { fetchEvents } from "./services/events";
import { fetchBirthdays } from "./services/birthdays";
import { db, collection, getDocs } from "./firebase";
import './App.css';

export default function App() {
  const [eventData, setEventData] = useState([]);// useState maakt een stukje data aan met een beginwaarde (bijv. een lijst of tekst) en setState wordt gebruikt om die waarde aan te passen; elke keer als setState wordt aangeroepen, herlaadt React automatisch het scherm met de nieuwe waarde zodat de UI up-to-date blijft.
  const [error, setError] = useState(null);

  // Haal data op na eerste load en her-render bij setEventData
  useEffect(() => {
    fetchEvents()
      .then(setEventData)//then wacht tot fetchEvents() klaar is en voert dan setEventData uit
      .catch((err) => {
        console.error(err);
        setError("Er is iets misgegaan bij het ophalen van de data.");
      });// catch vangt fouten op en zet error state dit getrowd zijn vauit services/events.js
  }, []);

 return (
  <div>
    <h1>Jouw volgende eventen</h1>  
    {error && <p>{error}</p>}    {/* AND-poort als error waar is geeft die de error */}
    <ul>
      {/*"ternary operator", oftewel een compacte if-else*/}
      {eventData.length === 0 ? (
        <li>U are Free!</li>
      ) : (
        eventData.map((event, i) => (
          <li className="grid" key={i}>{/* // key helpt React bijhouden welk item welk is tijdens hertekenen */}
            <div className="event">
              <strong>Examen:</strong> {event.name} <br />
              <strong>Datum:</strong> {event.date?.toDate().toLocaleString() || "Geen datum beschikbaar"}
            </div>
          </li>
        ))
      )}
    </ul>
  </div>
);
}