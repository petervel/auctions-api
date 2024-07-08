import { Item, ItemComment } from "@prisma/client";
import { decode } from "html-entities";
import prisma from "../../prismaClient";
import { Result, ok } from "../util/result";
import {
	extractNumber,
	extractString,
	parseEndDateString,
	removeStrikethrough,
} from "../util/util";
import { ItemCommentProcessor } from "./ItemCommentProcessor";

export class ListItemProcessor {
	public static async update(
		listId: number,
		source: Record<string, any>
	): Promise<Result<Item, String>> {
		const itemId = Number(source["@_id"]);

		const item: Item = await prisma.item.create({
			data: {
				bggId: itemId,
				listId: listId,
				objectType: source["@_objecttype"],
				objectSubtype: source["@_subtype"],
				objectId: Number(source["@_objectid"]),
				objectName: decode(source["@_objectname"]),
				username: decode(source["@_username"]),
				postDate: new Date(source["@_postdate"]),
				editDate: new Date(source["@_editdate"]),
				thumbs: Number(source["@_thumbs"]),
				imageId: Number(source["@_imageid"]),
				body: decode(source["body"]),
				// comments: { connect: { id: itemId } },
				deleted: false,
				...this.getDerivedData(removeStrikethrough(source["body"])),
			},
		});

		let comments: ItemComment[] = [];
		if (source["comment"]) {
			const commentsData = Array.isArray(source["comment"])
				? source["comment"]
				: [source["comment"]];
			const results = await Promise.all(
				commentsData.map(
					async (commentData) =>
						await ItemCommentProcessor.update(item.id, commentData)
				)
			);
			for (const result of results) {
				if (result.isOk()) {
					comments.push(result.value);
				} else {
					console.log(`Error saving item comment: ${result.error}`);
					return result;
				}
			}
		}

		return ok(item);
	}

	private static getDerivedData(text: string) {
		const item: Record<string, any> = {};
		item.language =
			extractString(
				text,
				/(?:\[b\])?\s*languages?(?:\[\/b\])?\s*:\s*(?:\[[^\]]*])*([^[\n]*)/i
			) ?? item.language;
		const condition = extractString(
			text,
			/(?:\[b\])?\s*condition(?:\[\/b\])?\s*:?\s*(?:\[[^\]]*])*([^[\n]*)/i
		);
		if (condition)
			item.condition =
				condition?.replace(/:[a-z]+:/g, "").trim() ?? item._condition;

		item.startingBid =
			extractNumber(
				text,
				/(?:\[b\])?\s*starting\s*(?:bid)?(?:price)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€?(?:euro)?\s*(\d+)(?:,-)?€?(?:euro)?(?:[^[\n]*)/i
			) ?? item.startingBid;
		item.softReserve =
			extractNumber(
				text,
				/(?:\[b\])?\s*soft\s*(?:reserve)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€\s*(\d+)(?:,-)?(?:[^[\n]*)/i
			) ?? item.softReserve;
		item.hardReserve =
			extractNumber(
				text,
				/(?:\[b\])?\s*hard\s*(?:reserve)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€\s*(\d+)(?:,-)?(?:[^[\n]*)/i
			) ?? item.hardReserve;
		item.binPrice =
			extractNumber(
				text,
				/(?:\[b\])?\s*bin\s*(?:price)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€?(?:euro)?\s*(\d+)(?:,-)?(?:[^[\n]*)/i
			) ?? item.binPrice;

		const auctionEnd = extractString(
			text,
			/(?:\[b\])?\s*auction ends(?:\[\/b\])?\s*:?\s*(?:\[[^\]]*])*([^[\n]*)/i
		);
		if (auctionEnd) {
			item.auctionEnd = auctionEnd
				.replace(/^,/, "")
				.replace(/,$/, "")
				.replace(/^[\s,]*/, "");
			item.auctionEndDate = parseEndDateString(auctionEnd);
		}

		const editTimestamp = Date.parse(item.editDate);
		const commentEdits = [0];
		// item.comments.map(
		// 	(comment: ItemComment) => comment.editTimestamp
		// );
		const latest = Math.max(editTimestamp, ...commentEdits);
		item.editTimestamp = latest;

		return item;
	}
}

interface Bid {
	username: string;
	value: number;
}
