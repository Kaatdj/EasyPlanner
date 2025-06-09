import { db, collection, getDocs, doc, setDoc } from "../firebase";// ../ als buiten map te halen

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export async function fetchWaterIntakeToday() {
  try {
    const querySnapshot = await getDocs(collection(db, "waterIntake"));
    const now = new Date();
    const waterIntakeToday = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((entry) => {
        const entryDate = entry.date ? new Date(entry.date) : null;
        return entryDate && isSameDay(entryDate, now);
      });

    return waterIntakeToday[0]?.liter ?? 0;
  } catch (error) {
    console.error("Error getting water intake: ", error);
    throw new Error("Er is iets misgegaan bij het ophalen van de waterinname.");
  }
}

export async function putWaterIntakeByDate(dateStr, liter) {
  try {
    const docRef = doc(db, "waterIntake", dateStr);//dateStr is je document ID
    await setDoc(docRef, {
      date: dateStr,
      liter: liter,
    }, { merge: true }); // merge als document al bestaat anders maak het aan
    return true;
  } catch (error) {
    console.error("Error updating water intake: ", error);
    throw new Error("Er is iets misgegaan bij het bijwerken van de waterinname.");
  }
}
