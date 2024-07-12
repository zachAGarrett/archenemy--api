export interface Seed {
  std: number;
  mean: number;
  min: number;
  max: number;
}
export interface TargetConfig {
  min: number;
  max: number;
}
export interface SyntheticSampleProps {
  seed: Seed;
  size: number;
  config: TargetConfig;
}
