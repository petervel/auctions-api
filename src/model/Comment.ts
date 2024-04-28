import { db } from "./../db";

class BaseComment {
	username: string;
	date: string;
	post_date: string;
	edit_date: string;
	edit_timestamp: number;
	thumbs: number;
	text: string;

	constructor(
		username: string,
		date: string,
		post_date: string,
		edit_date: string,
		edit_timestamp: number,
		thumbs: number,
		text: string
	) {
		this.username = username;
		this.date = date;
		this.post_date = post_date;
		this.edit_date = edit_date;
		this.edit_timestamp = edit_timestamp;
		this.thumbs = thumbs;
		this.text = text;
	}
}

export class ListComment extends BaseComment {
	list_id: number;

	constructor(
		list_id: number,
		username: string,
		date: string,
		post_date: string,
		edit_date: string,
		edit_timestamp: number,
		thumbs: number,
		text: string
	) {
		super(username, date, post_date, edit_date, edit_timestamp, thumbs, text);
		this.list_id = list_id;
	}

	private toSqlArray(): any[] {
		return [
			this.list_id,
			this.username,
			this.date,
			this.post_date,
			this.edit_date,
			this.edit_timestamp,
			this.thumbs,
			this.text,
		];
	}

	public save() {
		const sql =
			"replace into list_comments(\
					list_id, \
					username, \
					date, \
					post_date, \
					edit_date, \
					edit_timestamp, \
					thumbs, \
					text \
				) values (?)";

		db.query(sql, [this.toSqlArray()]);
	}
}

export class ItemComment extends BaseComment {
	item_id: number;
	is_bin: boolean;
	bid?: number;

	constructor(
		item_id: number,
		username: string,
		date: string,
		post_date: string,
		edit_date: string,
		edit_timestamp: number,
		thumbs: number,
		text: string,
		is_bin: boolean,
		bid: number | undefined
	) {
		super(username, date, post_date, edit_date, edit_timestamp, thumbs, text);
		this.item_id = item_id;
		this.is_bin = is_bin;
		this.bid = bid;
	}
}
