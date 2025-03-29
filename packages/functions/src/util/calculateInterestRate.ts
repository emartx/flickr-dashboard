import { PhotoStat } from "./types";

const FAVES_WEIGHT = 0.4;
const COMMENTS_WEIGHT = 0.6;

export const calculateInterestRate = (views: number, faves: number, comments: number) => {
  if (views === 0) {
    return 0;
  }
  const interestRate = ((faves * FAVES_WEIGHT + comments * COMMENTS_WEIGHT) / views) * 100;

  return parseFloat(interestRate.toFixed(2));
}

export const isEmptyStat = (stat: PhotoStat) => {
  return (
    stat.views === 0 &&
    stat.faves === 0 &&
    stat.comments === 0
  );
}
