import * as logger from "firebase-functions/logger";
import { callFlickrAPI } from "../util/flickrUtils";
import { failResult, successResult } from "../util/generalResult";

export const getUserProfile = async (flickrUserId: string) => {
  try {
    const data = await callFlickrAPI("flickr.profile.getProfile", {
      user_id: flickrUserId,
    });

    if (data?.stat === "ok") {
      const flickrProfile = data.profile;
      logger.info(`User Profile for ${flickrUserId} fetched:`, flickrProfile);
      return successResult(flickrProfile);
    } else {
      return failResult(404, "User not found: " + data?.message);
    }
  } catch (error: unknown) {
    logger.error("API Request Failed", error);
    return failResult(
      500,
      "API Request Failed: " + (error as { message: string }).message
    );
  }
};
