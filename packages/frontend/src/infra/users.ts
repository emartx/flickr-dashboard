import {
	doc,
	getDoc,
	getFirestore,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import useApi from "./useApi";
import { User } from "@flickr-dashboard/core/src/types";
import { showErrorMessage } from "../util/errorType";

const useUserApis = () => {
	const db = getFirestore();
  const { getApi } = useApi();

	const callApiGetAndSaveFlickrUserId = async (
		userName: string | undefined
	) => {
		if (!userName) return "";

		const response = await getApi<{flickrUserId: string}>(
			"https://getandsaveprofilebyusername-ag5w5dzqxq-uc.a.run.app",
			{
				params: { userName: userName },
			}
		);
    return response;
	};

	const getUserInfo = async (firebaseUserId: string): Promise<User> => {
		const userRef = doc(db, "users", firebaseUserId);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			return userDoc.data() as User;
		} else {
			showErrorMessage("Error in saving user info in DB");
		}
		return new Promise((_res, rej) => rej({}));
	};

	const callApiSaveOrUpdateUser = async (user: FirebaseUser) => {
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

  return {
    callApiGetAndSaveFlickrUserId,
    getUserInfo,
    callApiSaveOrUpdateUser,
  }
};

export default useUserApis;
