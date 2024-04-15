import express from 'express';
import dotenv from "dotenv";
import mysql, { Connection } from "mysql2";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const connection: Connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT ?? "3306"),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

app.get('/', (req, res) => {
	connection.query("select name from events", (error, results, fields) => {
		if (error) throw error;
		res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
	});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});