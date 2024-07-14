import { ItemComment } from "@prisma/client";
import { decode } from "html-entities";
import {
	extractNumber,
	extractString,
	parseEndDateString,
	removeStrikethrough,
} from "../util/util";
import { ItemCommentProcessor } from "./ItemCommentProcessor";

export type ListItemData = {
	id: number;
	listId: number;
	objectType: any;
	objectSubtype: any;
	objectId: number;
	objectName: string;
	username: string;
	postDate: Date;
	editDate: Date;
	thumbs: number;
	imageId: number;
	body: string;
	deleted: boolean;
};

export class ListItemProcessor {
	public static parseData(
		listId: number,
		source: Record<string, any>
	): { itemData: ListItemData; commentData: ItemComment[] } {
		const itemId = Number(source["@_id"]);

		const commentsData = ListItemProcessor.getCommentsData(
			itemId,
			source["comment"]
		);

		return {
			itemData: {
				id: itemId,
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
				deleted: false,
				...this.getDerivedData(source["body"], commentsData, false),
				...this.getDerivedData(source["body"], commentsData),
			},
			commentData: commentsData,
		};
	}

	private static getDerivedData(
		text: string,
		commentsData: Record<string, any>[],
		removeStrikeThrough: boolean = true
	) {
		text = removeStrikeThrough ? removeStrikethrough(text) : text;

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
		const commentEdits = commentsData.map(
			(comment: Record<string, any>) => comment.editTimestamp
		);
		const latest = Math.max(editTimestamp, ...commentEdits);
		item.editTimestamp = latest;

		return item;
	}

	private static getCommentsData(itemId: number, source: String) {
		if (!source) return [];

		const commentsArray = Array.isArray(source) ? source : [source];

		return commentsArray.map((commentData) =>
			ItemCommentProcessor.parseData(itemId, commentData)
		);
	}
}

interface Bid {
	username: string;
	value: number;
}
