import admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { callFlickrAPI } from "../util/flickrUtils";
import { checkCORS, checkAuthorization } from "../util/webUtils";
import { readCurrentUserFlickrId } from "../services";
import { ErrorObj, FlickrResult } from "@flickr-dashboard/core/src/types";
import { Request, Response } from "firebase-functions/v1";

export const fetchRecentFlickrPhotos = functions.https.onRequest(
	async (req: Request, res: Response<FlickrResult | ErrorObj>) => {
		const logPrefix = "[FetchRecentPhotos]";
		const log = (message: string, ...params: unknown[]) => logger.info(logPrefix, message, ...params);

		log("fetchRecentFlickrPhotos() is called.");

		checkCORS(req, res);

		try {
			const authResult = await checkAuthorization(req, admin);
			if (!authResult.isDone) {
				logger.error(logPrefix, "Error:", authResult.message);
				res.status(authResult.status).json({ message: authResult.message });
				return;
			}
			const currentFirebaseUserId = authResult.data as string;
			const flickrUserId = await readCurrentUserFlickrId(currentFirebaseUserId);
			log(`Flickr User ID: ${flickrUserId}`);

			const todayMorning = new Date();
			todayMorning.setHours(5, 0, 0, 0);
			log("Today Morning:", todayMorning);
			const result: FlickrResult = await callFlickrAPI("flickr.photos.search", {
				user_id: flickrUserId,
				min_upload_date: todayMorning,
			});
			log(`${result.photos.total} photos are fetched.`);

			res.status(200).json(result);
		} catch (error: unknown) {
			logger.error(logPrefix, "Error fetching recent Flickr photos:", error);
			res
				.status(500)
				.json({
					message: "Error fetching recent Flickr photos:\n" +
						(error as { message: string }).message
			});
		}
	}
);
