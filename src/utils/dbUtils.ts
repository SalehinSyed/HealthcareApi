import express from "express";
import pool from "../config/dbConfig";

export async function handleDatabaseOperation(
  operation: () => Promise<any>, // changed to Promise<any> to allow returning data
  res: express.Response,
  onSuccess: (data: any) => void // callback function to handle success
) {
  try {
    await pool.query("BEGIN"); // Start transaction
    const result = await operation(); // potentially returning data
    await pool.query("COMMIT"); // Commit transaction if operation succeeds
    onSuccess(result); // handle success with the result
  } catch (error: unknown) {
    await pool.query("ROLLBACK"); // Roll back transaction on error
    if (error instanceof Error) {
      res.status(500).send("Database error: " + error.message);
    } else {
      res.status(500).send("An unknown database error occurred");
    }
  }
}
