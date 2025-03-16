import axios from "axios";
import { getFirestore, setDoc, doc, collection, getDocs } from "firebase/firestore";
import { Photo, PhotoFlickr, PhotoPayload } from "../types/photos";
import { getToken } from "./tokenManager";

export const fetchPhotos = async (userId: string) => {
  if (!userId) return [];
  try {
    const db = getFirestore();
    const photosRef = collection(db, "users", userId, "photos");
    const photoDocs = await getDocs(photosRef);
    return photoDocs.docs.map(photoDoc => ({ ...photoDoc.data(), id: photoDoc.id } as Photo));
  } catch (error: unknown) {
    console.error("Error Fetching Photos: ", (error as Error).message);
    return [] as Photo[];
  }
};

export const getRecentPhotos = async () => {
  try {
    const token = getToken();
    const response = await axios.get(
      "https://fetchrecentflickrphotos-ag5w5dzqxq-uc.a.run.app/",
      {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.photos;
  } catch (error) {
    console.error(error);			
  }
  return [];
};

export const saveNewPhotos = async (newPhotos: PhotoFlickr[], firebaseUserId: string) => {
  if (newPhotos.length > 0) {
    const db = getFirestore();
    newPhotos.forEach(async (photo: PhotoFlickr) => {
      const photoDetails: PhotoPayload = {
        secret: photo.secret,
        server: photo.server,
        timestamp: new Date().toISOString(),
        title: photo.title,
        totalComments: 0,
        totalFaves: 0,
        totalViews: 0,
      }
      const photoRef = doc(db, "users", firebaseUserId, "photos", photo.id);
      await setDoc(photoRef, photoDetails);
      console.log(`Added photo with id: ${photo.id}`);
    });
  }
};

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
