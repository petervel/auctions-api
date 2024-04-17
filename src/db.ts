import dotenv from "dotenv";
import mysql, { Connection } from "mysql2";

dotenv.config();

export const db: Connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT ?? "3306"),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

export default db;