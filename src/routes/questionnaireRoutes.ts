import * as QuestionnaireController from "../controllers/questionnaireController";

import { Router } from "express";

const router = Router();

// improvement send me count in the header
router.get("/", QuestionnaireController.apiRunning);
router.get("/questionnaires", QuestionnaireController.getQuestionnaires);
router.post(
  "/submit-questionnaire",
  QuestionnaireController.submitQuestionnaire
);

export default router;
