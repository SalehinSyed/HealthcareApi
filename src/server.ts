import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import questionnaireRoutes from "./routes/questionnaireRoutes";

// Loading environment variables from the .env file
dotenv.config();

// Creating an Express application
const app = express();

// Setting the port for the server from the environment variables or defaulting to 3001
const PORT = process.env.PORT || 3001;

// Using the CORS middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Using the body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Using the questionnaire routes for the root path
app.use("/", questionnaireRoutes);

// Starting the server on the specified port if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Exporting the app to be used in other parts of the application
export default app;
