// import { CommentProcessor } from "./CommentProcessor";
// import { decode } from "html-entities";
// import { db } from "../init";
// import { AuctionList } from "../../../data-model/auction-list";
// import { Comment } from "../../../data-model/comment";
// import { stripUndefined } from "../util";

// export class AuctionListProcessor {
// 	public static fromBggObject(source: Record<string, any>): AuctionList {
// 		let comments: Comment[] = [];
// 		if (source["comment"]) {
// 			const commentsData = Array.isArray(source["comment"]) ? source["comment"] : [source["comment"]];
// 			comments = commentsData.map((commentData) => CommentProcessor.fromBggObject(commentData));
// 		}

// 		let editTimestamp = Number(source["editdate_timestamp"]);
// 		const commentEdits = comments.map((comment) => comment.edit_timestamp);
// 		editTimestamp = Math.max(editTimestamp, ...commentEdits);

// 		const list: AuctionList = {
// 			id: Number(source["@_id"]),
// 			title: decode(source["title"]),
// 			username: decode(source["username"]),
// 			post_date: source["postdate"],
// 			post_timestamp: Number(source["postdate_timestamp"]),
// 			edit_date: source["editdate"],
// 			edit_timestamp: editTimestamp,
// 			thumbs: Number(source["thumbs"]),
// 			item_count: Number(source["numitems"]),
// 			description: decode(source["description"]),
// 			tos_url: source["@_termsofuse"],
// 			comments: comments,
// 		};

// 		return list;
// 	}

// 	public static async save(list: AuctionList, afterTimestamp: number) {
// 		if (list.edit_timestamp >= afterTimestamp) {
// 			await db.ref(`auction_lists/${list.id}`).update(stripUndefined(list));
// 		}
// 	}
// }
