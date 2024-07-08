import { SyntheticSampleProps } from "../../lib/syntheticSample/src/types.js";
import syntheticSample from "../../lib/syntheticSample/index.js";
import profileSample from "../../lib/profileSample.js";

export default async function synthesize(
  _: any,
  args: { payload: SyntheticSampleProps }
) {
  const payload: SyntheticSampleProps = args.payload;

  // Validate payload here if needed

  // Handle the payload and create a synthetic sample
  const sample = await syntheticSample(payload);
  const profile = profileSample(sample);

  return {
    message: "Synthetic sample created successfully",
    sample,
    profile,
  };
}
