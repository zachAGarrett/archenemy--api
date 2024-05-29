import shouldAcceptOutlier from "./shouldAcceptOutlier.js";
import randomValue from "./randomValue.js";
import { Summary, TargetConfig } from "./types.js";

export default async function acceptOrResample(
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
