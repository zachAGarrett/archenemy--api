export default function estimateArrowStatistics(
  totalScore: number,
  numArrows: number = 72,
  maxPossibleScore: number = 10,
  minPossibleScore: number = 0
): { min: number; mean: number; max: number; std: number } {
  // Calculate the mean arrow score
  const mean = totalScore / numArrows;

  // Estimate the standard deviation based on the typical spread of arrows in archery
  // Assuming a standard deviation that reflects tighter grouping near the center
  // Standard deviation based on observed data, considering clustering effect
  const estimatedStdDev = mean > 9 ? 1 : mean > 8 ? 1.5 : mean > 6 ? 2 : 2.5;

  // Calculate min and max values
  // Min value can't be less than the minimum possible score
  const min = Math.max(minPossibleScore, mean - 3 * estimatedStdDev);

  // Max value can't be more than the maximum possible score
  const max = Math.min(maxPossibleScore, mean + 3 * estimatedStdDev);

  return { min, mean, max, std: estimatedStdDev };
}
