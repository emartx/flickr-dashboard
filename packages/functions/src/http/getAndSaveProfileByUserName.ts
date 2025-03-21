import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { checkAuthorization, checkCORS } from "../util/webUtils";
import { getUserId, getUserProfile } from "../services";
import { db } from "..";
import { ErrorObj, FlickrUser, User } from "@flickr-dashboard/core/src/types";
import { Request, Response } from "firebase-functions/v1";

export const getAndSaveProfileByUserName = functions.https.onRequest(
  async (req: Request, res: Response<{ flickrUserId: string } | ErrorObj>) => {
    logger.info("[getAndSaveProfileByUserName] is called.");

    checkCORS(req, res);

    const authResult = await checkAuthorization(req, admin);
    if (!authResult.isDone) {
      logger.error("Error: ", authResult.message);
      res.status(authResult.status).json({ message: authResult.message });
      return;
    }
    const currentFirebaseUserId = authResult.data as string;

    try {
      const flickrUserName = req.query.userName as string || "";
      if (!flickrUserName) throw new Error("A user name should be provided.");
      logger.info(`Target User Name: ${flickrUserName}`);

      const flickrUserResult = await getUserId(flickrUserName);
      if (!flickrUserResult.isDone) {
        logger.error("Error: ", flickrUserResult.message);
        res
          .status(flickrUserResult.status)
          .json({ message: flickrUserResult.message });
        return;
      }
      const flickrUserId = flickrUserResult.data as string;

      const flickrUserProfileResult = await getUserProfile(flickrUserId);
      if (!flickrUserProfileResult.isDone) {
        logger.error("Error: ", flickrUserProfileResult.message);
        res
          .status(flickrUserProfileResult.status)
          .json({ message: flickrUserProfileResult.message });
        return;
      }
      const flickrUserProfile = flickrUserProfileResult.data as FlickrUser;

      const flickrUser: Partial<User> = {
        flickrUserId: flickrUserId,
        flickrUserName: flickrUserName,
        ...flickrUserProfile,
      }

      const userRef = db.collection("users").doc(currentFirebaseUserId);
      await userRef.set(flickrUser, { merge: true });

      res.status(200).json({
        flickrUserId: flickrUserId,
      });
    } catch (error: unknown) {
      logger.error("Error fetching Flickr User:", error);
      res
        .status(500)
        .json({
          message: "Error fetching Flickr User:\n" +
            (error as { message: string }).message
        });
    }
  }
);
