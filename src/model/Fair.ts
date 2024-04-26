import { db } from "../db";

type FairStatus = "active" | "archived";

export class Fair {
	id: number;
	name: string;
	geeklist_id: number;
	status: FairStatus;

	constructor(
		id: number,
		name: string,
		geeklist_id: number,
		status: FairStatus
	) {
		this.id = id;
		this.name = name;
		this.geeklist_id = geeklist_id;
		this.status = status ?? "active";
	}

	static all = async (): Promise<Fair[]> => {
		const [results] = await db.promise().query("select * from fairs");
		const parsed = JSON.parse(JSON.stringify(results));
		const fairs = parsed.map((data: Record<string, any>) =>
			Fair.toObject(data)
		);

		return fairs;
	};

	static toObject = (data: Record<string, any>): Fair => {
		return new Fair(data.id, data.name!, data.geeklist_id!, data.status);
	};
}
