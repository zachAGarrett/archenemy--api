interface Profile {
  mean: number;
  std: number;
}
export default function scaleValue(
  value: number,
  sample: Profile,
  random: Profile
) {
  return (sample.std * (value - random.mean)) / random.std + sample.mean;
}
