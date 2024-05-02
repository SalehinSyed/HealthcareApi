import pool from "../config/dbConfig";

/**
 * Fetches the chronic details for a specific questionnaire from the database.
 *
 * @param number questionnaireId - The ID of the questionnaire.
 * @returns Promise - A promise that resolves to the chronic details of the questionnaire.
 */
export const getChronicDetails = async (questionnaireId: number) => {
  // SQL query text to select all fields from the chronic_details table where the questionnaire_id matches the provided id
  const queryText = "SELECT * FROM chronic_details WHERE questionnaire_id = $1";

  // Parameters to be used in the SQL query
  const queryParams = [questionnaireId];

  // Executing the query using the pool
  const response = await pool.query(queryText, queryParams);

  // Returning the first row of the response (the chronic details for the questionnaire)
  return response.rows[0];
};
