import express from 'express';
import { db } from '../../db';

const router = express.Router();

router.get('/', (_, res) => {
	db.query("select name from events", (error, results, fields) => {
		if (error) throw error;
		res.json({ response: "AUCTIONS", "status": 200 });
	});
});

export default router;