import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import questionnaireRoutes from "./routes/questionnaireRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use("/", questionnaireRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
