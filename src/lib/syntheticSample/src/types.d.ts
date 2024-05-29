
export interface Summary {
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
    sampleSummary: Summary;
    size: number;
    config: TargetConfig;
  }



