import { Request, Response } from "express";
import syntheticSample from "../../lib/syntheticSample/index.js";
import { SyntheticSampleProps } from "../../lib/syntheticSample/src/types.js";

export default async function synthesize(req: Request, res: Response) {
  const payload: SyntheticSampleProps = req.body;

  // Validate payload here if needed

  // Handle the payload and create a synthetic sample

  const sample = await syntheticSample(payload);

  console.log(sample);

  const response = {
    message: "Synthetic sample created successfully",
    payload: sample,
  };

  res.json(response);
}
