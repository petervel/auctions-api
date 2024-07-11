import { decode } from "html-entities";
import prisma from "../../prismaClient";
import { ok } from "./../util/result";
import { ItemCommentData } from "./ItemCommentProcessor";
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

		const list = await prisma.list.create({
			data: {
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
			},
		});

		for (let i = 0; i < commentsData.length; i += BATCH_SIZE) {
			const batch = commentsData.slice(i, i + BATCH_SIZE);
			console.log(`Creating list comments batch ${i}`);
			await prisma.listComment.createMany({ data: batch });
		}

		const { itemsData, itemCommentsData } = GeekListProcessor.getItemsData(
			listId,
			source["item"]
		);

		for (let i = 0; i < itemsData.length; i += BATCH_SIZE) {
			const batch = itemsData.slice(i, i + BATCH_SIZE);
			console.log(`Creating item batch ${i} - ${i + BATCH_SIZE}`);
			await prisma.item.createMany({ data: batch });
		}

		for (let i = 0; i < itemCommentsData.length; i += BATCH_SIZE) {
			const batch = itemCommentsData.slice(i, i + BATCH_SIZE);
			console.log(`Creating item comments batch ${i}`);
			await prisma.itemComment.createMany({ data: batch });
		}

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
	): { itemsData: ListItemData[]; itemCommentsData: ItemCommentData[] } {
		if (!source) return { itemsData: [], itemCommentsData: [] };

		const itemsArray = Array.isArray(source) ? source : [source];

		const itemsData = [];
		let itemCommentsData: ItemCommentData[] = [];
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
