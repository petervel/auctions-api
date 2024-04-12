const express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;

const mysql = require("mysql");

app.use(function (req, res, next) {
	res.locals.connection = mysql.createConnection({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});
	res.locals.connection.connect();
	next();
});

app.get('/', (req, res) => {
	res.locals.connection.query("select name from events", function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});