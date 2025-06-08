import { useState, useEffect } from "react";
import { db, collection, getDocs } from "./firebase";
import './App.css';

export default function App() {
  const [eventData, setEventData] = useState([]);
  const [error, setError] = useState(null);  // Een state om eventuele fouten op te slaan

  useEffect(() => {
    const getEventData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        console.log("Query Snapshot: ", querySnapshot); // Log de querysnapshot om te zien of data wordt opgehaald

        const eventList = querySnapshot.docs.map((doc) => doc.data());
        console.log("Event Data: ", eventList); // Log de opgehaalde data

        setEventData(eventList); // Gegevens in de state zetten
      } catch (error) {
        console.error("Error getting documents: ", error);  // Log eventuele fouten
        setError("Er is iets misgegaan bij het ophalen van de data.");
      }
    };

    getEventData();
  }, []);

  return (
    <div>
      <h1>Events</h1>
      {error && <p>{error}</p>}  {/* Toon eventuele fouten */}
      <ul>
        {eventData.length > 0 ? (
          eventData.map((event, index) => {
            // Controleer of je 'event.date' een geldig Firestore timestamp object is
            const eventDate = event.date ? event.date.toDate().toLocaleString() : "Geen datum beschikbaar";
            return (
              <li class="grid" key={index}>
                <div class="event">
                  <strong>Examen:</strong> {event.name} <br />
                  <strong>Datum:</strong> {eventDate}
                </div>
              </li>
            );
          })
        ) : (
          <li>Geen evenementen gevonden</li>
        )}
      </ul>
    </div>
  );
}
