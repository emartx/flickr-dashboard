import { doc, getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore();

export const getUserInfo = async (firebaseUserId: string) => {
  const userRef = doc(db, "users", firebaseUserId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};