import { ItemComment } from "@prisma/client";
import { decode } from "html-entities";
import prisma from "../../prismaClient";
import { ok } from "./../util/result";
import { ListCommentProcessor } from "./ListCommentProcessor";
import { ListItemData, ListItemProcessor } from "./ListItemProcessor";

const BATCH_SIZE = 1000;

export class GeekListProcessor {
	public static async update(fairId: number, source: Record<string, any>) {
		const listId = Number(source["@_id"]);

		const commentsData = GeekListProcessor.getCommentsData(
			listId,
			source["comment"]
		);

		let editTimestamp = Number(source["editdate_timestamp"]);
		const commentEdits = commentsData.map((comment) => comment.editTimestamp);
		editTimestamp = Math.max(editTimestamp, ...commentEdits);

		const listData = {
			id: listId,
			fair: { connect: { id: fairId } },
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
		};
		const list = await prisma.list.upsert({
			where: { id: listId },
			create: listData,
			update: listData,
		});

		const listCommentUpserts = commentsData.map((commentData) =>
			prisma.listComment.upsert({
				where: {
					listId_username_postTimestamp: {
						listId: commentData.listId,
						username: commentData.username,
						postTimestamp: commentData.postTimestamp,
					},
				},
				create: commentData,
				update: commentData,
			})
		);

		await prisma.$transaction(listCommentUpserts);

		const { itemsData, itemCommentsData } = GeekListProcessor.getItemsData(
			listId,
			source["item"]
		);

		const itemUpserts = itemsData.map((itemData) =>
			prisma.item.upsert({
				where: { id: itemData.id },
				create: itemData,
				update: itemData,
			})
		);

		await prisma.$transaction(itemUpserts);

		const itemCommentUpserts = itemCommentsData.map((commentData) =>
			prisma.itemComment.upsert({
				where: {
					itemId_username_postTimestamp: {
						itemId: commentData.itemId,
						username: commentData.username,
						postTimestamp: commentData.postTimestamp,
					},
				},
				create: commentData,
				update: commentData,
			})
		);

		await prisma.$transaction(itemCommentUpserts);

		return ok(list);
	}

	private static getCommentsData(listId: number, source: String) {
		if (!source) return [];

		const commentsArray = Array.isArray(source) ? source : [source];

		return commentsArray.map((commentData) =>
			ListCommentProcessor.parseData(listId, commentData)
		);
	}

	private static getItemsData(
		listId: number,
		source: String
	): { itemsData: ListItemData[]; itemCommentsData: ItemComment[] } {
		if (!source) return { itemsData: [], itemCommentsData: [] };

		const itemsArray = Array.isArray(source) ? source : [source];

		const itemsData = [];
		let itemCommentsData: ItemComment[] = [];
		for (const itemArray of itemsArray) {
			const { itemData, commentData } = ListItemProcessor.parseData(
				listId,
				itemArray
			);

			itemsData.push(itemData);
			itemCommentsData = itemCommentsData.concat(commentData);
		}

		return { itemsData, itemCommentsData };
	}
}
