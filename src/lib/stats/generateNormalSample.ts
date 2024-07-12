import { round } from "mathjs";
import { Ziggurat } from "./ziggurat";

export default function generateSample(
  { min, mean, max }: { min: number; mean: number; max: number },
  sampleSize: number,
  preciseValues: boolean = true
): number[] {
  const ziggurat = new Ziggurat();
  const sample: number[] = [];
  const stdDev = (max - min) / 6; // Rough approximation assuming a 99.7% coverage within [min, max]

  for (let i = 0; i < sampleSize; i++) {
    let value: number;
    do {
      value = ziggurat.next() * stdDev + mean;
    } while (value < min || value > max);
    sample.push(preciseValues ? value : round(value));
  }

  return sample;
}
