import { erf } from "mathjs";
import randomValue from "./randomValue.js";
import { Summary, TargetConfig } from "./types.js";

export default function shouldAcceptOutlier(
  value: number,
  sampleProfile: Summary,
  config: TargetConfig
) {
  const { mean, std } = sampleProfile;
  const { min, max } = config;
  if (value < min || value > max) {
    // If the value is outside the target range, reject it.
    return false;
  }

  // Calculate the Z-score of the value based on the provided mean and standard deviation.
  const zScore = (value - mean) / std;

  // Use the cumulative distribution function (CDF) of the standard normal distribution
  // to calculate the acceptance probability.
  const acceptanceProbability = 0.5 * (1 + erf(zScore / Math.sqrt(2)));

  // Generate a random number between 0 and 1 to decide whether to accept the value.
  return randomValue(0, 1) <= acceptanceProbability;
}
