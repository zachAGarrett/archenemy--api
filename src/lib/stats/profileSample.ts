import { mean, min, max, std } from "mathjs";

export default function profileSample(sample: number[]) {
  const profile = {
    mean: mean(sample),
    std: std(sample),
    min: min(sample),
    max: max(sample),
  };

  return profile;
}
