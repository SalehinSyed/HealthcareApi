import * as QuestionnaireController from "../controllers/questionnaireController";

import { Router } from "express";

// Creating a new router
const router = Router();

// Setting up the route handlers
// GET / - checks if the API is running
router.get("/", QuestionnaireController.apiRunning);

// GET /questionnaires - fetches all questionnaires
router.get("/questionnaires", QuestionnaireController.getQuestionnaires);

// POST /submit-questionnaire - submits a new questionnaire
router.post(
  "/submit-questionnaire",
  QuestionnaireController.submitQuestionnaire
);

// Exporting the router to be used in other parts of the application
export default router;
