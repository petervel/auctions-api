// import { decode } from "html-entities";
// import { Comment, AuctionComment } from "../../../data-model/comment";
// import { extractString, removeStrikethrough, removeQuoted } from "../util";

// export class CommentProcessor {
// 	public static fromBggObject(source: Record<string, any>): Comment {
// 		return {
// 			username: decode(source["@_username"]),
// 			date: source["@_date"],
// 			post_date: source["@_postdate"],
// 			edit_date: source["@_editdate"],
// 			edit_timestamp: Number(Date.parse(source["@_editdate"])),
// 			thumbs: Number(source["@_thumbs"]),
// 			text: decode(`${source["#text"]}`), // force this to be a string, for parsing purposes.
// 		};
// 	}
// }

// export class AuctionCommentProcessor extends CommentProcessor {
// 	public static fromBggObject(source: Record<string, any>): AuctionComment {
// 		const obj = CommentProcessor.fromBggObject(source) as AuctionComment;

// 		if (obj.text.length != 0) {
// 			let stripped = removeStrikethrough(obj.text);

// 			stripped = removeQuoted(stripped);

// 			obj.is_bin = !!extractString(stripped, /\b(bin)\b/i);

// 			obj.bid = AuctionCommentProcessor.findBidNumber(stripped);
// 		}

// 		return obj;
// 	}

// 	private static findBidNumber(text: string): number | undefined {
// 		const bid = AuctionCommentProcessor.findBidText(text);
// 		if (bid) {
// 			const bidNumber = Number(bid);
// 			if (bidNumber < 1000) { // dirty sanity check. should fix this properly in regex
// 				return bidNumber;
// 			}
// 		}
// 		return undefined;
// 	}

// 	private static findBidText(text: string): string | undefined {
// 		let bid = extractString(text, /(?:€\s*(\d+))|(?:(\d+)\s*€)/i);
// 		if (bid) return bid;

// 		bid = extractString(text, /(?:\b(?:euros?)\s*(\d+))|(?:(\d+)\s*(?:euros?))\b/i);
// 		if (bid) return bid;

// 		bid = extractString(text, /(?:\b[E]\s*(\d+))|(?:(\d+)\s*[E]\b)/i);
// 		if (bid) return bid;

// 		bid = extractString(text, /(?:\b(\d+)\b)/);
// 		if (bid) return bid;

// 		return undefined;
// 	}
// }
