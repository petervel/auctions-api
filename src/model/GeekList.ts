import { db } from "./../db";
import { ListComment } from "./Comment";
import { ListItem } from "./ListItem";

export class GeekList {
	id: number | undefined;
	title: string;
	username: string;
	post_date: string;
	post_timestamp: number;
	edit_date: string;
	edit_timestamp: number;
	thumbs: number;
	item_count: number;
	description: string;
	tos_url: string;
	comments: ListComment[];

	items: ListItem[];

	constructor(
		id: number | undefined,
		title: string,
		username: string,
		post_date: string,
		post_timestamp: number,
		edit_date: string,
		edit_timestamp: number,
		thumbs: number,
		item_count: number,
		description: string,
		tos_url: string,
		comments: ListComment[],
		items: ListItem[]
	) {
		this.id = id;
		this.title = title;
		this.username = username;
		this.post_date = post_date;
		this.post_timestamp = post_timestamp;
		this.edit_date = edit_date;
		this.edit_timestamp = edit_timestamp;
		this.thumbs = thumbs;
		this.item_count = item_count;
		this.description = description;
		this.tos_url = tos_url;
		this.comments = comments;
		this.items = items;
	}

	private toSqlArray(): any[] {
		return [
			this.id,
			this.title,
			this.username,
			this.post_date,
			this.post_timestamp,
			this.edit_date,
			this.edit_timestamp,
			this.thumbs,
			this.item_count,
			this.description,
			this.tos_url,
		];
	}

	public save() {
		const sql =
			"replace into lists(\
				id, \
				title, \
				username, \
				post_date, \
				post_timestamp, \
				edit_date, \
				edit_timestamp, \
				thumbs, \
				item_count, \
				description, \
				tos_url\
			) values (?)";

		db.query(sql, [this.toSqlArray()]);

		for (const comment of this.comments) {
			console.log(comment.edit_timestamp);
			comment.save();
		}
	}
}
