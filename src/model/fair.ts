import { QueryResult } from "mysql2";
import { db } from "../db";

export class Fair {
	id: number;
	name: string;
	geeklist_id: number;

	constructor(id: number, name: string, geeklist_id: number) {
		this.id = id;
		this.name = name;
		this.geeklist_id = geeklist_id;
	}

	static all = async () => {
		const [results, fields] = await db.promise().query("select * from fairs");
		const parsed = JSON.parse(JSON.stringify(results));
		return parsed.map(Fair.toObject);
	};

	static toObject = (data: Record<string, any>) => {
		return new Fair(
			data.id,
			data.name!,
			data.geeklist_id!
		);
	};
}