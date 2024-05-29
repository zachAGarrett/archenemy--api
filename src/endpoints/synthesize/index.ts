import { Request, Response } from "express";
import syntheticSample from "../../lib/syntheticSample/index.js";
import { SyntheticSampleProps } from "../../lib/syntheticSample/src/types.js";
import profileSample from "../../lib/profileSample.js";

export default async function synthesize(req: Request, res: Response) {
  const payload: SyntheticSampleProps = req.body;

  // Validate payload here if needed

  // Handle the payload and create a synthetic sample

  const sample = await syntheticSample(payload);
  const profile = profileSample(sample);

  const response = {
    message: "Synthetic sample created successfully",
    payload: { sample, profile },
  };

  res.json(response);
}
