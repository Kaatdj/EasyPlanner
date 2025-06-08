import { db, collection, getDocs } from "../firebase";

export function getTodayKey() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
}

export async function fetchUpcomingBirthdays() {
  try {
    const todayKey = getTodayKey();

    const querySnapshot = await getDocs(collection(db, "birthdays"));
    const allBirthdays = querySnapshot.docs.map((doc) => doc.data());

    // Filter and sort only future + today birthdays
    const upcoming = allBirthdays
      .filter(b => Number(b.date) >= todayKey)
      .sort((a, b) => Number(a.date) - Number(b.date));

    return upcoming;
  } catch (error) {
    console.error("Error fetching upcoming birthdays:", error);
    throw new Error("Fout bij ophalen van aankomende verjaardagen.");
  }
}
export async function fetchFirstUpcommingBirthday() {
  try {
    const upcomingBirthdays = await fetchUpcomingBirthdays();
    return upcomingBirthdays[0]; // eerste element
  } catch (error) {
    console.error("Error fetching upcoming birthday:", error);
    throw new Error("Fout bij ophalen van aankomende verjaardagen.");
  }
}

