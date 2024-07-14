import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import routes from "./api";
import { updateData } from "./importer/util/updateData";

for (const route of routes) {
	app.use(route.path, route.object);
}

app.use("/update", async (_, res) => {
	const succesful = await updateData();
	if (succesful) {
		return res.json({ status: 201 });
	} else {
		return res.json({ status: 202 });
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
