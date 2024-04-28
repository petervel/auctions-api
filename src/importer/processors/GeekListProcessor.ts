import { decode } from "html-entities";
import { ListComment } from "model/Comment";
import { GeekList } from "../../model/GeekList";
import { ListCommentProcessor } from "./CommentProcessor";
import { ListItemProcessor } from "./ListItemProcessor";

export class GeekListProcessor {
	public static fromBggObject(source: Record<string, any>): GeekList {
		const listId = Number(source["@_id"]);

		let comments: ListComment[] = [];
		if (source["comment"]) {
			const commentsData = Array.isArray(source["comment"])
				? source["comment"]
				: [source["comment"]];

			comments = commentsData.map((commentData) =>
				ListCommentProcessor.fromBggObject(listId, commentData)
			);
		}

		let editTimestamp = Number(source["editdate_timestamp"]);
		const commentEdits = comments.map((comment) => comment.edit_timestamp);
		editTimestamp = Math.max(editTimestamp, ...commentEdits);

		const itemsArray = !source["item"]
			? []
			: Array.isArray(source["item"])
			? source["item"]
			: [source["item"]];

		const items = itemsArray.map(ListItemProcessor.fromBggObject);

		const list: GeekList = new GeekList(
			listId,
			decode(source["title"]),
			decode(source["username"]),
			source["postdate"],
			Number(source["postdate_timestamp"]),
			source["editdate"],
			editTimestamp,
			Number(source["thumbs"]),
			Number(source["numitems"]),
			decode(source["description"]),
			source["@_termsofuse"],
			comments,
			items
		);

		return list;
	}

	public static async save(list: GeekList, afterTimestamp: number) {
		if (list.edit_timestamp >= afterTimestamp) {
			// await db.ref(`auction_lists/${list.id}`).update(list);
		}
	}
}
