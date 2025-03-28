import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { failResult, successResult } from "./generalResult";
import { Request, Response } from "firebase-functions/v1";

const allowedOrigins = [
  "https://flickr-dashboard.web.app",
  "https://flickr-dashboard.firebaseapp.com",
  "http://localhost:5173",
  "http://localhost:5174", //TODO: should be removed when deploying to production
];

export const checkCORS = (req: Request, res: Response) => {
  const currentOrigin = req.headers.origin || "";
  if (allowedOrigins.includes(currentOrigin)) {
    res.set("Access-Control-Allow-Origin", currentOrigin);
  }
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
};

type AdminType = typeof admin;
export const checkAuthorization = async (req: Request, admin: AdminType) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return failResult(401, "Unauthorized: No token provided");
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const currentUserId = decodedToken.uid;
    return successResult(currentUserId);
  } catch (error: unknown) {
    logger.error("Error checking authorization", error);
    return failResult(401, "Error checking authorization:\n" + (error as {message: string}).message);
  }
};
