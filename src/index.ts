import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import synthesize from "./endpoints/synthesize/index.js";

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post(
  "/synthesize",
  async (req: Request, res: Response) => await synthesize(req, res)
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
