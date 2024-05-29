import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { SyntheticSampleProps } from "./lib/syntheticSample/src/types.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/synthesize", (req: Request, res: Response) => {
  const payload: SyntheticSampleProps = req.body;

  // Validate payload here if needed

  // Log the received payload (for demonstration purposes)
  console.log(payload);

  // Handle the payload and create a synthetic sample
  // This is just a placeholder response
  const response = {
    message: "Synthetic sample created successfully",
    payload: payload,
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
