import crypto from "crypto";
import { sqrt, log, sin, pi, round } from "mathjs";
/**
 * Generates a sample of random numbers following a skew-normal distribution,
 * bounded by a minimum and maximum value.
 *
 * @param {Object} sampleSeed - Object containing the min, mean, and max values.
 * @param {number} sampleSeed.min - The minimum value for the sample.
 * @param {number} sampleSeed.mean - The mean value around which the sample is centered.
 * @param {number} sampleSeed.max - The maximum value for the sample.
 * @param {number} sampleSize - The number of random values to generate.
 * @param {boolean} [preciseValues=true] - Whether to use precise values or rounded values.
 * @returns {number[]} An array of random numbers following the specified skew-normal distribution.
 */
export default function generateSkewSample(
  sampleSeed: { min: number; mean: number; max: number; std: number },
  sampleSize: number,
  preciseValues: boolean = true
): number[] {
  const { min, mean, max, std } = sampleSeed;

  // Initialize the array to hold the sample values
  const sample: number[] = [];

  // Define a positive skew value to cluster more arrows toward the center
  const skew = 1.4;

  // Generate the sample
  for (let I = 0; I < sampleSize; I++) {
    let value: number;

    // Generate a skew-normal random value within the specified bounds
    do {
      value = randomSkewNormal(mean, std, skew);
    } while (value < min || value > max); // Ensure the value is within the bounds

    // Add the value to the sample array
    // Use precise values if preciseValues is true, otherwise round the value
    sample.push(preciseValues ? value : round(value));
  }

  return sample;
}

/**
 * Generates a cryptographically secure random number between 0 and 1.
 * @returns A random number between 0 and 1.
 */
export function secureRandom(): number {
  const randomBuffer = new Uint32Array(1);
  crypto.randomFillSync(randomBuffer);
  return randomBuffer[0] / 0xffffffff;
}

/**
 * Generates a random number from a skew-normal distribution.
 *
 * @param mean - The mean (location) of the distribution.
 * @param stdDev - The standard deviation (scale) of the distribution.
 * @param skew - The skewness (shape) of the distribution. Positive values skew to the right, negative to the left.
 * @returns A random number following the skew-normal distribution.
 */
export function randomSkewNormal(
  mean: number,
  stdDev: number,
  skew: number
): number {
  // Generate two cryptographically secure random numbers between 0 and 1
  let u0 = secureRandom();
  let v = secureRandom();

  // Transform the uniformly distributed random numbers into a normally distributed random value
  // Using the Box-Muller transform to convert (u0, v) into a standard normal distribution (mean 0, stdDev 1)
  let value = (sqrt(-2.0 * log(u0)) as number) * sin(2.0 * pi * v);

  // Calculate the skew factor
  let delta = skew / (sqrt(1 + skew * skew) as number);

  // Apply the skew to the normally distributed random value
  // Creating a weighted sum of the normal value and another uniform random number
  let u1 = delta * value + (sqrt(1 - delta * delta) as number) * secureRandom();

  // Adjust the sign of the value based on the skew factor
  // This ensures that the skewness is properly applied
  let z = u1 > 0 ? value : -value;

  // Scale the skew-normal value to the desired mean and standard deviation
  return mean + stdDev * z;
}
