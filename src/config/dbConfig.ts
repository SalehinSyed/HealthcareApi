import { Pool } from "pg";
import dotenv from "dotenv";

// Calling the config function on 'dotenv' to load the environment variables
dotenv.config();

// Creating a new pool of connections to the PostgreSQL database using the environment variables
const pool = new Pool({
  user: process.env.DB_USER, // The user name for the database
  host: process.env.DB_HOST, // The host of the database
  database: process.env.DB_DATABASE, // The database name
  password: process.env.DB_PASSWORD, // The password for the database user
  port: parseInt(process.env.DB_PORT || "5432"), // The port of the database, defaulting to 5432 if not provided
});

// Exporting the pool to be used in other parts of the application
export default pool;
