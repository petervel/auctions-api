import db from "db";
import { decode } from "html-entities";
import { CommentProcessor } from "./CommentProcessor";
import { Comment } from "model/Comment";
import { GeekList } from "model/GeekList";

export class GeekListProcessor {
	public static fromBggObject(source: Record<string, any>): GeekList {
		let comments: Comment[] = [];
		if (source["comment"]) {
			const commentsData = Array.isArray(source["comment"])
				? source["comment"]
				: [source["comment"]];

			comments = commentsData.map((commentData) =>
				CommentProcessor.fromBggObject(commentData)
			);
		}

		let editTimestamp = Number(source["editdate_timestamp"]);
		const commentEdits = comments.map((comment) => comment.edit_timestamp);
		editTimestamp = Math.max(editTimestamp, ...commentEdits);

		const list: GeekList = {
			id: Number(source["@_id"]),
			title: decode(source["title"]),
			username: decode(source["username"]),
			post_date: source["postdate"],
			post_timestamp: Number(source["postdate_timestamp"]),
			edit_date: source["editdate"],
			edit_timestamp: editTimestamp,
			thumbs: Number(source["thumbs"]),
			item_count: Number(source["numitems"]),
			description: decode(source["description"]),
			tos_url: source["@_termsofuse"],
			comments: comments,
		};

		return list;
	}

	public static async save(list: GeekList, afterTimestamp: number) {
		if (list.edit_timestamp >= afterTimestamp) {
			// await db.ref(`auction_lists/${list.id}`).update(list);
		}
	}
}
