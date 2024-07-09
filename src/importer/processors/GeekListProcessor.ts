import { Fair, Item, List, ListComment } from "@prisma/client";
import { decode } from "html-entities";
import prisma from "../../prismaClient";
import { Result, ok } from "../util/result";
import { ListCommentProcessor } from "./ListCommentProcessor";
import { ListItemProcessor } from "./ListItemProcessor";

export class GeekListProcessor {
	public static async update(
		fair: Fair,
		source: Record<string, any>
	): Promise<Result<List, String>> {
		const listId = Number(source["@_id"]);

		let editTimestamp = Number(source["editdate_timestamp"]);
		const commentEdits = [0]; //comments.map((comment) => comment.editTimestamp);
		editTimestamp = Math.max(editTimestamp, ...commentEdits);

		const listData = {
			id: listId,
			fair: { connect: { id: fair.id } },
			title: decode(source["title"]),
			username: decode(source["username"]),
			postDate: new Date(source["postdate"]),
			postTimestamp: Number(source["postdate_timestamp"]),
			editDate: new Date(source["editdate"]),
			editTimestamp,
			thumbs: Number(source["thumbs"]),
			itemCount: Number(source["numitems"]),
			description: decode(source["description"]),
			tosUrl: source["@_termsofuse"],
			// comments: { connect: { id: listId } },
			// items: { connect: { id: listId } },
		};

		const list: List = await prisma.list.upsert({
			where: { id: listId },
			create: listData,
			update: listData,
		});

		const itemsArray = !source["item"]
			? []
			: Array.isArray(source["item"])
			? source["item"]
			: [source["item"]];

		const itemResults = await Promise.all(
			itemsArray.map(
				async (itemData) => await ListItemProcessor.update(list.id, itemData)
			)
		);
		const items: Item[] = [];
		for (const result of itemResults) {
			if (result.isOk()) {
				items.push(result.value);
			} else {
				console.log(`Problem parsing comment: ${result.error}`);
				return result;
			}
		}
		let comments: ListComment[] = [];
		if (source["comment"]) {
			const commentsData = Array.isArray(source["comment"])
				? source["comment"]
				: [source["comment"]];

			const results = await Promise.all(
				commentsData.map(
					async (commentData) =>
						await ListCommentProcessor.update(list.id, commentData)
				)
			);

			for (const result of results) {
				if (result.isOk()) {
					comments.push(result.value);
				} else {
					console.log(`Problem parsing comment: ${result.error}`);
					return result;
				}
			}
		}

		return ok(list);
	}

	public static async save(list: List, afterTimestamp: number) {
		if (list.editTimestamp >= afterTimestamp) {
			// await db.ref(`auction_lists/${list.id}`).update(list);
		}
	}
}
