import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// import { createConnection } from "mysql";
const prisma = new PrismaClient();

// app.use(function (req, res, next) {
// 	res.locals.connection = createConnection({
// 		host: process.env.DB_HOST,
// 		port: process.env.DB_PORT,
// 		database: process.env.DB_NAME,
// 		user: process.env.DB_USER,
// 		password: process.env.DB_PASSWORD,
// 	});
// 	res.locals.connection.connect();
// 	next();
// });

app.get('/', async (req, res) => {
	const events = await prisma.event.findMany();
	res.json({ "status": 200, "error": null, "response": events });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});