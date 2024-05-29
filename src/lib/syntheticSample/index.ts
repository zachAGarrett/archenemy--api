import { std, mean } from "mathjs";
import crypto from "node:crypto";
import { SyntheticSampleProps } from "./src/types.js";
import scaleValue from "./src/scaleValue.js";
import acceptOrResample from "./src/acceptOrResample.js";

export default async function syntheticSample({
  sampleSummary,
  size,
  config = { min: 0, max: 10 },
}: SyntheticSampleProps) {
  // Generate an array of cryptographically random values of the size specified
  const randomArray = new Uint32Array(size);
  crypto.randomFillSync(randomArray);

  // Evaluate the standard deviation and mean of the generated random values
  const randomArraySummary = {
    std: std(...randomArray),
    mean: mean(...randomArray),
  };

  let acceptedValues: Array<number> = [];

  for (let i = 0; i < randomArray.length; i++) {
    const n = randomArray[i];
    const nScaled = scaleValue(n, sampleSummary, randomArraySummary); // Scale n to the sample properties

    /**
     * Accept the scaled value of n when it falls inside the target range.
     * When it does not fall inside the target range, decide to accept it or resample
     * using the cumulative distribution function (CDF) of the standard normal distribution
     * to calculate the acceptance probability.
     */
    let acceptedValue: number;
    const outlier = nScaled < sampleSummary.min || nScaled > sampleSummary.max;

    if (outlier) {
      acceptedValue = await acceptOrResample(nScaled, sampleSummary, config);
    } else {
      acceptedValue = nScaled;
    }
    acceptedValues.push(acceptedValue);
  }

  return acceptedValues;
}
