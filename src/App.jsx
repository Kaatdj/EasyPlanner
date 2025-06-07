import { useState, useEffect } from "react";
import { db, collection, getDocs } from "./firebase";  // Import Firebase-configuratie

export default function App() {
  const [eventData, setEventData] = useState([]);

  // Gegevens ophalen uit Firestore
  useEffect(() => {
    const getEventData = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map((doc) => doc.data());
      setEventData(eventList);
    };

    getEventData();
  }, []);

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {eventData.map((event, index) => (
          <li key={index}>
            <strong>Examen:</strong> {event.name} <br />
            <strong>Datum:</strong> {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
