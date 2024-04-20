// import { decode } from "html-entities";
// import * as Util from "../util";
// import { AuctionItem } from "../../../data-model/auction-item";
// import { AuctionComment } from "../../../data-model/comment";
// import { AuctionCommentProcessor } from "./CommentProcessor";
// import { AuctionItemView } from "../../../data-model/auction-item-view";
// import db from "db";

// export class AuctionItemProcessor {
// 	public static save(auctionId: number, item: AuctionItem) {
// 		const promises: Promise<void>[] = [];
// 		promises.push(db.ref(`auction_items/${auctionId}/${item.id}`).update(Util.stripUndefined(item)));
// 		const viewObject = this.getViewObject(item);
// 		promises.push(db.ref(`auction_item_views/${auctionId}/${item.id}`).update(Util.stripUndefined(viewObject)));
// 		return promises;
// 	}

// 	public static fromBggObject(source: Record<string, any>): AuctionItem {
// 		let comments: AuctionComment[] = [];
// 		if (source["comment"]) {
// 			const commentsData = Array.isArray(source["comment"]) ? source["comment"] : [source["comment"]];
// 			comments = commentsData.map((commentData) => AuctionCommentProcessor.fromBggObject(commentData));
// 		}

// 		let item: AuctionItem = {
// 			id: Number(source["@_id"]),
// 			object_type: source["@_objecttype"],
// 			object_subtype: source["@_subtype"],
// 			object_id: Number(source["@_objectid"]),
// 			object_name: decode(source["@_objectname"]),
// 			username: decode(source["@_username"]),
// 			post_date: source["@_postdate"],
// 			edit_date: source["@_editdate"],
// 			thumbs: Number(source["@_thumbs"]),
// 			image_id: Number(source["@_imageid"]),
// 			body: decode(source["body"]),
// 			comments: comments,
// 			deleted: false,
// 		};

// 		item = this.addDerivedData(item, item.body);
// 		item = this.addDerivedData(item, Util.removeStrikethrough(item.body)); // override the above

// 		return item;
// 	}

// 	private static addDerivedData(item: AuctionItem, text: string): AuctionItem {
// 		item._language = Util.extractString(text, /(?:\[b\])?\s*languages?(?:\[\/b\])?\s*:\s*(?:\[[^\]]*])*([^[\n]*)/i) ?? item._language;
// 		const condition = Util.extractString(text, /(?:\[b\])?\s*condition(?:\[\/b\])?\s*:?\s*(?:\[[^\]]*])*([^[\n]*)/i);
// 		if (condition) item._condition = condition?.replace(/:[a-z]+:/g, "").trim() ?? item._condition;

// 		item._starting_bid = Util.extractNumber(text, /(?:\[b\])?\s*starting\s*(?:bid)?(?:price)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€?(?:euro)?\s*(\d+)(?:,-)?€?(?:euro)?(?:[^[\n]*)/i) ?? item._starting_bid;
// 		item._soft_reserve = Util.extractNumber(text, /(?:\[b\])?\s*soft\s*(?:reserve)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€\s*(\d+)(?:,-)?(?:[^[\n]*)/i) ?? item._soft_reserve;
// 		item._hard_reserve = Util.extractNumber(text, /(?:\[b\])?\s*hard\s*(?:reserve)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€\s*(\d+)(?:,-)?(?:[^[\n]*)/i) ?? item._hard_reserve;
// 		item._bin_price = Util.extractNumber(text, /(?:\[b\])?\s*bin\s*(?:price)?(?:\[\/b\])?(?:\s*:\s*)?(?:\[[^\]]*])*€?(?:euro)?\s*(\d+)(?:,-)?(?:[^[\n]*)/i) ?? item._bin_price;

// 		const auctionEnd = Util.extractString(text, /(?:\[b\])?\s*auction ends(?:\[\/b\])?\s*:?\s*(?:\[[^\]]*])*([^[\n]*)/i);
// 		if (auctionEnd) {
// 			item._auction_end = auctionEnd.replace(/^,/, "").replace(/,$/, "").replace(/^[\s,]*/, "");
// 			item._auction_end_date = Util.parseEndDateString(auctionEnd);
// 		}

// 		const editTimestamp = Date.parse(item.edit_date);
// 		const commentEdits = item.comments.map((comment) => comment.edit_timestamp);
// 		const latest = Math.max(editTimestamp, ...commentEdits);
// 		item._edit_timestamp = latest;

// 		return item;
// 	}

// 	private static getBids(item: AuctionItem): Bid[] {
// 		const bids = [];
// 		for (const comment of item.comments) {
// 			if (comment.username == item.username) continue; // nobody's bidding on their own auction.

// 			if (comment.is_bin) {
// 				const value = comment.bid ?? item._bin_price ?? 1000; // hackish, should never happen.
// 				bids.push({ username: comment.username, value: value });
// 			} else if (comment.bid) {
// 				bids.push({ username: comment.username, value: comment.bid });
// 			}
// 		}

// 		return bids;
// 	}

// 	private static getViewObject(item: AuctionItem): AuctionItemView {
// 		const bids = this.getBids(item);

// 		let highestBid: Bid | undefined = undefined;
// 		for (const bid of bids) {
// 			if (highestBid == undefined || highestBid.value < bid.value) {
// 				highestBid = bid;
// 			}
// 		}

// 		let isSold = false;
// 		if (highestBid != undefined) {
// 			item._highest_bid = highestBid.value;
// 			isSold = item._highest_bid == item._bin_price;
// 		}

// 		const postedTimestamp = Date.parse(item.post_date);

// 		const strippedName = Util.stripObjectName(item.object_name);
// 		if (strippedName.length == 0) {
// 			console.error(`The object name ${item.object_name} was stripped completely!`);
// 		}

// 		let isEnded = isSold;
// 		const stripped = Util.removeStrikethrough(item.body);
// 		if (stripped.length < 100 && (stripped.length == 0 || (item.body.length / stripped.length > 4))) {
// 			isEnded = true;
// 		} else if (item._auction_end_date != undefined && item._auction_end_date < Util.formatTimeToDate()) {
// 			isEnded = true;
// 		}

// 		const itemView: AuctionItemView = {
// 			id: item.id,
// 			posted_timestamp: postedTimestamp,
// 			object_type: item.object_type,
// 			object_subtype: item.object_subtype,
// 			object_id: item.object_id,
// 			object_name: item.object_name,
// 			object_name_search: strippedName,
// 			username: item.username,
// 			image_id: item.image_id,
// 			has_bids: bids.length != 0,
// 			is_sold: isSold,
// 			is_ended: isEnded,
// 			first_letter: Util.getFirstLetterFromName(strippedName),
// 			username_search: item.username.toLowerCase(),
// 		};

// 		itemView.current_bid = item._highest_bid ?? item._starting_bid ?? item._soft_reserve ?? item._hard_reserve ?? item._bin_price ?? undefined;
// 		if (highestBid != undefined) {
// 			itemView.highest_bidder = highestBid.username;
// 			itemView.highest_bidder_search = highestBid.username.toLowerCase();
// 		}

// 		itemView.bin_price = item._bin_price;
// 		itemView.auction_end = item._auction_end;
// 		itemView.auction_end_search = item._auction_end_date;
// 		itemView.language = item._language;
// 		itemView.condition = item._condition;

// 		return itemView;
// 	}
// }

// interface Bid {
// 	username: string;
// 	value: number;
// }
