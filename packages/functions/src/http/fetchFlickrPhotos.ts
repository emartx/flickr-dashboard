import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { checkAuthorization, checkCORS } from "../util/webUtils";
import { callFlickrAPI } from "../util/flickrUtils";
import { getUserId, readCurrentUserFlickrId } from "../services";
import { ErrorObj, FlickrResult } from "@flickr-dashboard/core/src/types";
import { Request, Response } from "firebase-functions/v1";

export const fetchFlickrPhotos = functions.https.onRequest(
	async (req: Request, res: Response<FlickrResult | ErrorObj>) => {
		logger.info("[fetchFlickrPhotos] is called.");

		checkCORS(req, res);

		try {
			const flickrUserName = req.query.userName as string;
			const isPublicStr = req.query.isPublic as string;

			logger.info(
				flickrUserName
					? `Provided User Name: ${flickrUserName}`
					: "No Flickr User Name is provided."
			);

			let flickrUserId;
			if (flickrUserName) {
				const flickrUserResult = await getUserId(flickrUserName);
				if (!flickrUserResult.isDone) {
					logger.error("Error: ", flickrUserResult.message);
					res
						.status(flickrUserResult.status)
						.json({ message: flickrUserResult.message });
					return;
				}
				flickrUserId = flickrUserResult.data as string;
			} else {
				const authResult = await checkAuthorization(req, admin);
				if (!authResult.isDone) {
					logger.error("Error:", authResult.message);
					res.status(authResult.status).json({ message: authResult.message });
					return;
				}
				const currentFirebaseUserId = authResult.data as string;
				flickrUserId = await readCurrentUserFlickrId(currentFirebaseUserId);
			}
			logger.info(`Flickr User ID: ${flickrUserId}`);

			const isPublic =
				isPublicStr.trim().toLowerCase() === "true";
			const flickrMethodName = isPublic ? "getPublicPhotos" : "getPhotos";

			const result: FlickrResult = await callFlickrAPI("flickr.people." + flickrMethodName, {
				user_id: flickrUserId,
			});
			logger.info(`${result.photos.total} photos are fetched.`);

			res.status(200).json(result);
		} catch (error: unknown) {
			logger.error("Error fetching Flickr photos:", error);
			res
				.status(500)
				.json({
					message: "Error fetching Flickr photos:\n" +
						(error as { message: string }).message
				});
		}
	}
);
