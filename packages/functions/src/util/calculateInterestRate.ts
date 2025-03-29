const FAVES_WEIGHT = 0.4;
const COMMENTS_WEIGHT = 0.6;

export const calculateInterestRate = (views: number, faves: number, comments: number) => {
  if (views === 0) {
    return 0;
  }
  const interestRate = ((faves * FAVES_WEIGHT + comments * COMMENTS_WEIGHT) / views) * 100;

  return parseInt(interestRate.toFixed(0), 10);
}
