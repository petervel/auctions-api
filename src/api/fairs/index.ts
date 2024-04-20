import express from 'express';
import { db } from '../../db';

const router = express.Router();

router.get('/', (_, res) => {
	db.query("select * from fairs", (error, results, fields) => {
		if (error) throw error;
		res.json({ response: results, "status": 200 });
	});
});

export default router; ``;