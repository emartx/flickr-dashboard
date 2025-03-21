import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import axios from "axios";
import { getToken } from "./tokenManager";
import { User } from "@flickr-dashboard/core/src/types"
import { showErrorMessage } from "../util/errorType";

const db = getFirestore();

export const callApiGetAndSaveFlickrUserId = async (userName: string | undefined) => {
  if (!userName) return "";

  const token = getToken();
  const response = await axios.get("https://getandsaveprofilebyusername-ag5w5dzqxq-uc.a.run.app", {
    params: { userName: userName },
    headers: {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const flickrUserId: string = response.data.data.flickrUserId;
  return flickrUserId;
};

export const getUserInfo = async (firebaseUserId: string): Promise<User> => {
  const userRef = doc(db, "users", firebaseUserId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  } else {
    showErrorMessage("Error in saving user info in DB");
  }
  return new Promise((_res, rej) => rej({}));
};

export const callApiSaveOrUpdateUser = async (user: FirebaseUser) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    await setDoc(
      userRef,
      {
        lastLogin: new Date(),
      },
      { merge: true }
    );

    console.log("Last Login Date updated successfully.");

    return userDoc.data().flickrUserName;
  } else {
    const userData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(userRef, userData, { merge: true });
      console.log("User info saved successfully:", userData);
    } catch (error) {
      showErrorMessage(error, "Error in saving user info in DB");
    }
  }
};
