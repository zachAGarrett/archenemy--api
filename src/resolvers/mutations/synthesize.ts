import generateSkewSample from "../../lib/stats/generateSkewSample.js";
import profileSample from "../../lib/stats/profileSample.js";
import { SyntheticSampleProps } from "../../lib/stats/types.js";
export default async function synthesize(
  _: any,
  args: { payload: SyntheticSampleProps }
) {
  const payload: SyntheticSampleProps = args.payload;

  // Validate payload here if needed

  // Handle the payload and create a synthetic sample
  const sample = generateSkewSample(payload.seed, payload.size, false);
  const profile = profileSample(sample);

  return {
    message: "Synthetic sample created successfully",
    sample,
    profile,
  };
}
