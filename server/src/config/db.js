import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { createTables } from "./schema.js";
dotenv.config();

let db = null;

export const dbConnect = async () => {
  if (db) return db;
  try {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const connection = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    console.log("Database Created or Exists");

		db = await mysql.createConnection({
			host: host,
      user: user,
      password: password,
			database: database,
		})

    await createTables(db);
    console.log("Tables Created or Exists");

    return db;

  } catch (err) {
    console.log("Error connecting to Database", err.message);
  }
};

export const getDB = async (db) => {
  if (!db) await dbConnect();
  return db;
};
