import { db, collection, getDocs } from "../firebase";// ../ als buiten map te halen

export async function fetchBirthdays() {
  try {
    const querySnapshot = await getDocs(collection(db, "birthdays"));
    const birthdayList = querySnapshot.docs.map((doc) => doc.data());
    return birthdayList;
  } catch (error) {
    console.error("Error getting birthdays: ", error);
    throw new Error("Er is iets misgegaan bij het ophalen van de verjaardagen.");
  }
}