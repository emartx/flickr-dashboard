import axios from "axios";
import { getFirestore, setDoc, doc, collection, getDocs, getDoc } from "firebase/firestore";
import { FlickrResult, Photo, PhotoFlickr, PhotoPayload } from "@flickr-dashboard/core/src/types";
import { getToken } from "./tokenManager";
import { showErrorMessage } from "../util/errorType";

const db = getFirestore();

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

export const getRecentPhotos = async (): Promise<FlickrResult['photos']> => {
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
    return response.data.data.photos;
  } catch (error) {
    console.error(error);			
  }
  return new Promise((_res, rej) => rej([]));
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

export const getPhoto = async (photoId: string | undefined, firebaseUserId: string) => {
  if (!photoId) return null;

  try {
    const photoRef = doc(db, "users", firebaseUserId, "photos", photoId);
    const photoDoc = await getDoc(photoRef);

    if (photoDoc.exists()) {
      const photoObj = photoDoc.data() as Photo;
      return photoObj;
    } else {
      showErrorMessage("Photo not found", "Error Fetching Photos");
    }
  } catch (error) {
    showErrorMessage(error, "Error Fetching Photos");
  }
  return null;
};
