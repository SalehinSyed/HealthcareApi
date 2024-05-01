import app from "../server";
import pool from "../config/dbConfig";
import request from "supertest";

afterAll(async () => {
  await pool.end();
});

afterEach(async () => {
  // Clean up database entries to ensure each test runs in a clean state
  await pool.query("DELETE FROM questionnaires WHERE name = $1", ["John Doe"]);
  await pool.query("DELETE FROM questionnaires WHERE name = $1", ["Jane Doe"]);
});

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Healthcare App API Running");
  });
});

describe("GET /questionnaires", () => {
  it("should return all questionnaires", async () => {
    const response = await request(app).get("/questionnaires");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("POST /submit-questionnaire", () => {
  it("should create a new questionnaire", async () => {
    const newQuestionnaire = {
      name: "John Doe",
      age: 30,
      gender: "Male",
      health_condition: "Healthy",
      symptoms_present: false,
      symptoms_list: "",
    };
    const response = await request(app)
      .post("/submit-questionnaire")
      .send(newQuestionnaire);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Questionnaire submitted successfully"
    );
  });
});

describe("POST /submit-questionnaire", () => {
  it("should return 400 for invalid data", async () => {
    const invalidData = { name: "" }; // Deliberately missing most required fields
    const response = await request(app)
      .post("/submit-questionnaire")
      .send(invalidData);
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
});

describe("POST /submit-questionnaire and check database", () => {
  it("should insert and retrieve the questionnaire", async () => {
    const questionnaireData = {
      name: "Jane Doe",
      age: 28,
      gender: "Female",
      health_condition: "Minor illness",
      symptoms_present: true,
      symptoms_list: "Cough",
    };
    await request(app).post("/submit-questionnaire").send(questionnaireData);

    // Introducing a slight delay to ensure database operations complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    const getResponse = await request(app).get("/questionnaires");
    const found = getResponse.body.some(
      (item: Questionnaire) =>
        item.name.trim() === questionnaireData.name.trim()
    );

    expect(found).toBeTruthy();
  });
});

describe("POST /submit-questionnaire for chronic conditions", () => {
  afterAll(async () => {
    // Clean up the test data from the database
    await pool.query("DELETE FROM chronic_details");
    await pool.query("DELETE FROM questionnaires");
  });

  it("should insert data into both questionnaires and chronic_details tables", async () => {
    const questionnaireData = {
      name: "Jane Doe",
      age: 28,
      gender: "Female",
      health_condition: "Chronic illness",
      symptoms_present: true,
      symptoms_list: "Cough",
      chronicDetails: {
        detail: "Long-term asthma",
        medication: "Steroid inhaler",
      },
    };

    // Send POST request to the server
    const postResponse = await request(app)
      .post("/submit-questionnaire")
      .send(questionnaireData);
    expect(postResponse.status).toBe(201);

    // Verify that data was inserted into the main table
    const mainDataCheck = await pool.query(
      "SELECT * FROM questionnaires WHERE name = $1",
      [questionnaireData.name]
    );
    expect(mainDataCheck.rows.length).toBe(1);
    expect(mainDataCheck.rows[0]?.health_condition?.trim()).toBe(
      "Chronic illness"
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

// type for the expected structure of an error object
type ValidationError = {
  path: string[];
  message: string;
};

// type for questionnaire
type Questionnaire = {
  name: string;
  age: number;
  gender: string;
  health_condition: string;
  symptoms_present: boolean;
  symptoms_list: string;
};
