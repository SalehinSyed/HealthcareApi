import * as QuestionnaireModel from "../models/questionnaireModel";

import { Request, Response } from "express";

import { questionnaireSchema } from "../schemas/questionaireSchema";
import { z } from "zod";

export const getQuestionnaires = async (req: Request, res: Response) => {
  try {
    const result = await QuestionnaireModel.getAllQuestionnaires({
      page: parseInt(req.query.page as string) || 1,
      pageSize: parseInt(req.query.pageSize as string) || 10,
      health_condition: req.query.health_condition as string,
    });

    // Trim all string fields before sending the response
    const trimmedResults = result.rows.map((row) => {
      const trimmedRow: { [key: string]: any } = {};
      for (const key in row) {
        if (typeof row[key] === "string") {
          trimmedRow[key] = row[key].trim();
        } else {
          trimmedRow[key] = row[key];
        }
      }
      return trimmedRow;
    });

    res.status(200).json(trimmedResults);
  } catch (error) {
    console.error("Error fetching questionnaires: ", error);
    res.status(500).send("Failed to retrieve questionnaires");
  }
};

export const submitQuestionnaire = async (req: Request, res: Response) => {
  try {
    const parsed = questionnaireSchema.parse(req.body);
    const result = await QuestionnaireModel.insertQuestionnaire(parsed);
    res.status(201).json({
      message: "Questionnaire submitted successfully",
      result: result.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error("Server error:", error);
      res.status(500).send("Server error");
    }
  }
};

export const apiRunning = async (req: Request, res: Response) => {
  res.status(200).send("Healthcare App API Running");
};
