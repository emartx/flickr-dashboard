import * as functionsV2 from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { callFlickrAPI } from "../util/flickrUtils";
import { db } from "..";
import { PhotoStat } from "../util/types";
import { updateMaxPhotoStat, updateMinPhotoStat, getNewPhotoStat } from "../util/stats";
import retryWithBackoff from "../util/retryWithBackoff";
import runConcurrent from "../util/runConcurrent";
import { calculateInterestRate, isEmptyStat } from "../util/calculateInterestRate";

export const updateFlickrStats = functionsV2.onSchedule(
	"every day 06:00",
	async () => {
		const logPrefix = "[UpdateStats]";
		const log = (message: string, ...params: unknown[]) => logger.info(logPrefix, message, ...params);

		log("Cron Job Started: Fetching Flickr Stats...");

		const usersRef = db.collection("users");
		const usersSnapshot = await usersRef.get();

		const today = new Date().toISOString().split("T")[0];
		log("Today:", today);

		for (const userDoc of usersSnapshot.docs) {
			const userId = userDoc.id;
			const { flickrUserName } = userDoc.data();
			log("--------------------------------");
			log(`Checking the Photos owned by '${flickrUserName}' (${userId})`);
			const photosListRef = usersRef.doc(userId).collection("photos");
			const photosSnapshot = await photosListRef.get();

			const userStats = getNewPhotoStat();
			let minUserStats = getNewPhotoStat();
			let maxUserStats = getNewPhotoStat();

			const CONCURRENT_FLICKR_STATS = 5;
			await runConcurrent(photosSnapshot.docs, async (photoDoc) => {
				const photoId = photoDoc.id;
				log("- - - - - - - - - - - - - - - - -");
				log("Fetching the statistics of photo " + photoId);

				const currentPhoto = photoDoc.data();
				log(
					`Current stats for photo ${photoId}: Views -> ${currentPhoto.totalViews}, Faves -> ${currentPhoto.totalFaves}, Comments -> ${currentPhoto.totalComments}`
				);
				const yesterdayPhotoStats: PhotoStat = {
					views: currentPhoto.totalViews,
					faves: currentPhoto.totalFaves,
					comments: currentPhoto.totalComments,
				};

				try {
					const newPhotoStats = getNewPhotoStat();

					const result = await retryWithBackoff(() =>
						callFlickrAPI("flickr.photos.getInfo", { photo_id: photoId })
					);
					newPhotoStats.views = parseInt(result?.photo?.views, 10);
					newPhotoStats.comments = parseInt(result?.photo?.comments?._content, 10);

					const resultFaves = await retryWithBackoff(() =>
						callFlickrAPI("flickr.photos.getFavorites", {
							photo_id: photoId,
							per_page: 1,
						})
					);
					newPhotoStats.faves = parseInt(resultFaves?.photo?.total, 10);
					log(
						`New photo stats: Views -> ${newPhotoStats.views}, Faves -> ${newPhotoStats.faves}, Comments -> ${newPhotoStats.comments}`
					);

					userStats.views += newPhotoStats.views;
					userStats.faves += newPhotoStats.faves;
					userStats.comments += newPhotoStats.comments;

					minUserStats = updateMinPhotoStat(minUserStats, newPhotoStats);
					maxUserStats = updateMaxPhotoStat(maxUserStats, newPhotoStats);

					if (newPhotoStats.views < minUserStats.views) minUserStats.views = newPhotoStats.views;
					if (newPhotoStats.faves < minUserStats.faves) minUserStats.faves = newPhotoStats.faves;
					if (newPhotoStats.comments < minUserStats.comments) minUserStats.comments = newPhotoStats.comments;

					if (isEmptyStat(yesterdayPhotoStats)) {
						log(
							`No previous stats. Initializing stats for photo ${photoId} from user '${flickrUserName}'`
						);

						yesterdayPhotoStats.views = newPhotoStats.views;
						yesterdayPhotoStats.faves = newPhotoStats.faves;
						yesterdayPhotoStats.comments = newPhotoStats.comments;
					}

					const interestRate = calculateInterestRate(
						newPhotoStats.views,
						newPhotoStats.faves,
						newPhotoStats.comments
					);
					log(`New photo interest rate -> ${interestRate}`);

					await photosListRef.doc(photoId).set(
						{
							totalViews: newPhotoStats.views,
							totalFaves: newPhotoStats.faves,
							totalComments: newPhotoStats.comments,
							interestRate: interestRate,
						},
						{ merge: true }
					);

					const todayPhotoStats: PhotoStat = {
						views: newPhotoStats.views - yesterdayPhotoStats.views,
						faves: newPhotoStats.faves - yesterdayPhotoStats.faves,
						comments: newPhotoStats.comments - yesterdayPhotoStats.comments,
					};
					const todayStatsRef = photosListRef
						.doc(photoId)
						.collection("history")
						.doc(today);
					await todayStatsRef.set({
						faves: todayPhotoStats.faves,
						comments: todayPhotoStats.comments,
						views: todayPhotoStats.views,
						interestRate: interestRate,
					});

					log(
						`Updated stats for photo ${photoId} from user '${flickrUserName}' for today (${today}).`
					);
				} catch (error) {
					logger.error(
						`${logPrefix} Failed to fetch stats for photo ${photoId}:`,
						error
					);
				}
			}, CONCURRENT_FLICKR_STATS);

			await usersRef.doc(userId).update({
				totalViews: userStats.views,
				totalFaves: userStats.faves,
				totalComments: userStats.comments,
				maxViews: maxUserStats.views,
				maxFaves: maxUserStats.faves,
				maxComments: maxUserStats.comments,
				minViews: minUserStats.views,
				minFaves: minUserStats.faves,
				minComments: minUserStats.comments,
			});

			log(`Updated user stats for '${flickrUserName}' (${userId}):`);
			log(`	-> Total Values (${userStats.views}, ${userStats.faves}, ${userStats.comments})`)
			log(`	-> Max Values (${maxUserStats.views}, ${maxUserStats.faves}, ${maxUserStats.comments})`)
			log(`	-> Min Values (${minUserStats.views}, ${minUserStats.faves}, ${minUserStats.comments})`)
		}

		log("Flickr Stats Fetcher Cron Job Completed.");
	}
);
