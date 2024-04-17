import dotenv from "dotenv";
dotenv.config();

import express from 'express';
const app = express();

import events from './events';
app.use('/events', events);

import auctions from "./auctions";
app.use("/auctions", auctions);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});