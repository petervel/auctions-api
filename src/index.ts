import dotenv from "dotenv";
dotenv.config();

import express from 'express';
const app = express();

import routes from "./api";
import { updateData } from "./importer/util/updateData";

for (const route of routes) {
	app.use(route.path, route.object);
}

app.use("/update", (_, res) => {
	updateData();
	res.json({ status: 201 });
}
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});