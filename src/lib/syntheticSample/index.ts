import { std, mean } from "mathjs";
import crypto from "node:crypto";
import { Summary, SyntheticSampleProps, TargetConfig } from "./src/types.js";
import shouldAcceptOutlier from "./src/shouldAcceptOutlier.js";
import randomValue from "./src/randomValue.js";

export default async function syntheticSample({
  sampleSummary,
  size,
  config = { min: 0, max: 10 },
}: SyntheticSampleProps) {
  // Generate an array of cryptographically random values of the size specified
  const syntheticSample = new Uint32Array(size);
  crypto.randomFillSync(syntheticSample);

  // Evaluate the standard deviation and mean of the generated random values
  const syntheticSampleSummary = {
    std: std(...syntheticSample),
    mean: mean(...syntheticSample),
  };

  let acceptedValues: Array<number> = [];

  for (let i = 0; i < syntheticSample.length; i++) {
    const n = syntheticSample[i];

    const nScaled =
      (syntheticSampleSummary.std * (n - syntheticSampleSummary.mean)) /
      syntheticSampleSummary.std +
      syntheticSampleSummary.mean; // Scale n to the sample properties

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

export async function acceptOrResample(
  value: number,
  sampleProfile: Summary,
  config: TargetConfig
) {
  if (shouldAcceptOutlier(value, sampleProfile, config)) {
    return value;
  } else {
    let n = randomValue(config.min, config.max);

    return acceptOrResample(n, sampleProfile, config);
  }
}
