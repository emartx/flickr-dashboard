import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getToken } from "./tokenManager";
import axios from "axios";
import { UserType } from "../types/user";
import { showErrorMessage } from "../util/errorType";

const db = getFirestore();

export const getAndSaveFlickrUserId = async (userName: string | undefined) => {
  if (!userName) return "";

  const token = getToken();
  const response = await axios.get("https://checkflickrusername-ag5w5dzqxq-uc.a.run.app", {
    params: { userName: userName },
    headers: {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const flickrUserId: string = response.data.flickrUserId;
  return flickrUserId;
};

export const getUserInfo = async (firebaseUserId: string) => {
  const userRef = doc(db, "users", firebaseUserId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserType;
  } else {
    showErrorMessage("Error in saving user info in DB");
  }
  return null;
};