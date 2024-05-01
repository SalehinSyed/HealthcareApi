import pool from "../config/dbConfig";

export const getAllQuestionnaires = async (queryOptions: {
  page: number;
  pageSize: number;
  health_condition?: string;
}) => {
  const { page, pageSize, health_condition } = queryOptions;
  const offset = (page - 1) * pageSize;
  let queryText = "SELECT * FROM questionnaires";
  let queryParams = [];

  if (health_condition) {
    queryText += " WHERE health_condition = $1";
    queryParams.push(health_condition);
  }

  queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(pageSize);
  queryParams.push(offset);

  return await pool.query(queryText, queryParams);
};

export const insertQuestionnaire = async (data: any) => {
  const {
    name,
    age,
    gender,
    health_condition,
    symptoms_present,
    symptoms_list,
    chronicDetails,
  } = data;

  const insertText =
    "INSERT INTO questionnaires(name, age, gender, health_condition, symptoms_present, symptoms_list) VALUES($1, $2, $3, $4, $5, $6) RETURNING id";
  const insertValues = [
    name,
    age,
    gender,
    health_condition,
    symptoms_present,
    symptoms_list,
  ];

  // Execute the insert for the main questionnaire data
  const response = await pool.query(insertText, insertValues);
  const questionnaireId = response.rows[0].id;

  console.log(health_condition);

  // Check if health_condition is 'Chronic illness' and chronicDetails is provided
  if (health_condition === "chronic_illness" && chronicDetails) {
    const { detail, medication } = chronicDetails;
    const chronicInsertText =
      "INSERT INTO chronic_details(questionnaire_id, detail, medication) VALUES($1, $2, $3)";
    const chronicInsertValues = [questionnaireId, detail, medication];

    // Execute the insert for the chronic details
    await pool.query(chronicInsertText, chronicInsertValues);
  }

  return response; // Return the original insertion response (could adjust to include more details if needed)
};
