import { db, collection, getDocs } from "../firebase";// ../ als buiten map te halen

export async function fetchEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));// haalt de collectie events op uit de database
    const now = new Date();//huidige datum en tijd als een JavaScript Date object
    const eventList = querySnapshot.docs// docs/ doc als conventie voor documenten die je uit firebase haalt
      .map((doc) => doc.data())// doe voor elk item(doc) uit de lijst(docs)
      .filter((event) => event.date?.toDate() >= now) // alleen toekomstige
      .sort((a, b) => a.date.toDate() - b.date.toDate()); // sorteer oplopend
    return eventList;
  } catch (error) {
    console.error("Error getting events: ", error);
    throw new Error("Er is iets misgegaan bij het ophalen van de evenementen.");// throw error naar app.jsx, fout wordt doorgestuurd
  }
}