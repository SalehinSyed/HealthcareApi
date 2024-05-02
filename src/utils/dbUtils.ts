import express from "express";
import pool from "../config/dbConfig";

/**
 * Handles a database operation within a transaction.
 * If the operation is successful, it commits the transaction and calls the onSuccess callback.
 * If the operation fails, it rolls back the transaction and sends a 500 response.
 *
 * @param operation - The database operation to perform.
 * @param res - The Express response object.
 * @param onSuccess - The callback to call if the operation is successful.
 */
export async function handleDatabaseOperation(
  operation: () => Promise<any>,
  res: express.Response,
  onSuccess: (data: any) => void
) {
  try {
    // Start the transaction
    await pool.query("BEGIN");

    // Perform the operation, potentially returning data
    const result = await operation();

    // Commit the transaction if the operation succeeds
    await pool.query("COMMIT");

    // Handle success with the result
    onSuccess(result);
  } catch (error: unknown) {
    // Roll back the transaction on error
    await pool.query("ROLLBACK");

    if (error instanceof Error) {
      // If the error is an instance of Error, send a 500 response with the error message
      res.status(500).send("Database error: " + error.message);
    } else {
      // If the error is not an instance of Error, send a 500 response with a generic error message
      res.status(500).send("An unknown database error occurred");
    }
  }
}
