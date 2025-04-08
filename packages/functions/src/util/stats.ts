import { PhotoStat } from "./types";

export const getNewPhotoStat = (): PhotoStat => ({
	views: 0,
	faves: 0,
	comments: 0,
});

export const getMinPhotoStat = (minPhotoStat: PhotoStat, newPhotoStat: PhotoStat): PhotoStat => ({
  views: Math.min(minPhotoStat.views, newPhotoStat.views),
  faves: Math.min(minPhotoStat.faves, newPhotoStat.faves),
  comments: Math.min(minPhotoStat.comments, newPhotoStat.comments),
});

export const getMaxPhotoStat = (maxPhotoStat: PhotoStat, newPhotoStat: PhotoStat): PhotoStat => ({
  views: Math.max(maxPhotoStat.views, newPhotoStat.views),
  faves: Math.max(maxPhotoStat.faves, newPhotoStat.faves),
  comments: Math.max(maxPhotoStat.comments, newPhotoStat.comments),
});
