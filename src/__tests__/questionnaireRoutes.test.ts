import { Questionnaire, ValidationError } from "../types";

import app from "../server";
import pool from "../config/dbConfig";
import request from "supertest";

// After all tests have run, we close the database connection
afterAll(async () => {
  await pool.end();
});

// Before each test, we ensure the database is in a clean state
beforeEach(async () => {
  await pool.query("DELETE FROM questionnaires WHERE name = $1", ["John Doe"]);
  await pool.query("DELETE FROM questionnaires WHERE name = $1", ["Jane Doe"]);
});

// Helper function to make a POST request to /submit-questionnaire with given data
const postQuestionnaire = async (data: any) => {
  return await request(app).post("/submit-questionnaire").send(data);
};

// Test suite for GET /
describe("GET /", () => {
  // Test that the server is running and returns the expected response
  it("should return 200 OK when the server is running", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Healthcare App API Running");
  });
});

// Test suite for GET /questionnaires
describe("GET /questionnaires", () => {
  // Test that all questionnaires are returned
  it("should return all questionnaires", async () => {
    const response = await request(app).get("/questionnaires");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

// Test suite for POST /submit-questionnaire
describe("POST /submit-questionnaire", () => {
  // Test that a new questionnaire can be created
  it("should create a new questionnaire and return 201", async () => {
    const newQuestionnaire = {
      name: "John Doe",
      age: 30,
      gender: "Male",
      health_condition: "Healthy",
      symptoms_present: false,
      symptoms_list: "",
    };
    const response = await postQuestionnaire(newQuestionnaire);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Questionnaire submitted successfully"
    );
  });

  // Test that invalid data is rejected
  it("should return 400 for invalid data", async () => {
    const invalidData = { name: "" }; // Deliberately missing most required fields
    const response = await postQuestionnaire(invalidData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors.length).toBeGreaterThan(0); // Check if there are one or more error messages

    expect(
      response.body.errors.some((error: ValidationError) =>
        error.path.includes("age")
      )
    ).toBe(true);
    expect(
      response.body.errors.some((error: ValidationError) =>
        error.path.includes("gender")
      )
    ).toBe(true);
  });

  // Test that a questionnaire can be inserted and then retrieved
  it("should insert and retrieve the questionnaire", async () => {
    const questionnaireData = {
      name: "Jane Doe",
      age: 28,
      gender: "Female",
      health_condition: "Minor illness",
      symptoms_present: true,
      symptoms_list: "Cough",
    };
    await postQuestionnaire(questionnaireData);

    const getResponse = await request(app).get("/questionnaires");
    const found = getResponse.body.some(
      (item: Questionnaire) =>
        item.name.trim() === questionnaireData.name.trim()
    );

    expect(found).toBeTruthy();
  });

  // Test that data can be inserted into both questionnaires and chronic_details tables
  it("should insert data into both questionnaires and chronic_details tables", async () => {
    const questionnaireData = {
      name: "Jane Doe",
      age: 28,
      gender: "Female",
      health_condition: "chronic_illness",
      symptoms_present: true,
      symptoms_list: "Cough",
      chronicDetails: {
        detail: "Long-term asthma",
        medication: "Steroid inhaler",
      },
    };

    // Send POST request to the server
    const postResponse = await postQuestionnaire(questionnaireData);
    expect(postResponse.status).toBe(201);

    // Verify that data was inserted into the main table
    const mainDataCheck = await pool.query(
      "SELECT * FROM questionnaires WHERE name = $1",
      [questionnaireData.name]
    );
    expect(mainDataCheck.rows.length).toBe(1);
    expect(mainDataCheck.rows[0]?.health_condition?.trim()).toBe(
      "chronic_illness"
    );

    // Verify that data was also inserted into the chronic_details table
    const chronicDataCheck = await pool.query(
      "SELECT * FROM chronic_details WHERE questionnaire_id = $1",
      [mainDataCheck.rows[0].id]
    );
    expect(chronicDataCheck.rows.length).toBe(1);
    expect(chronicDataCheck.rows[0].detail).toBe("Long-term asthma");
    expect(chronicDataCheck.rows[0].medication).toBe("Steroid inhaler");
  });
});

// After each test, we clean up the test data from the database
afterEach(async () => {
  await pool.query("DELETE FROM chronic_details");
  await pool.query("DELETE FROM questionnaires");
});
