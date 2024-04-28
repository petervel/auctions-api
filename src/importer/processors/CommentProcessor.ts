import { decode } from "html-entities";
import { ItemComment, ListComment } from "../../model/Comment";
import { extractString, removeQuoted, removeStrikethrough } from "../util/util";

export class ListCommentProcessor {
	public static fromBggObject(listId: number, source: Record<string, any>) {
		return new ListComment(
			listId,
			decode(source["@_username"]),
			source["@_date"],
			source["@_postdate"],
			source["@_editdate"],
			Math.floor(Date.parse(source["@_editdate"]) / 1000),
			Number(source["@_thumbs"]),
			decode(`${source["#text"]}`) // force this to be a string, for parsing purposes.
		);
	}
}

export class ItemCommentProcessor {
	public static fromBggObject(
		itemId: number,
		source: Record<string, any>
	): ItemComment {
		const text = decode(`${source["#text"]}`); // force this to be a string, for parsing purposes.

		let is_bin = false;
		let bid = undefined;
		if (text.length != 0) {
			let stripped = removeStrikethrough(text);
			stripped = removeQuoted(stripped);
			is_bin = !!extractString(stripped, /\b(bin)\b/i);
			bid = ItemCommentProcessor.findBidNumber(stripped);
		}

		return new ItemComment(
			itemId,
			decode(source["@_username"]),
			source["@_date"],
			source["@_postdate"],
			source["@_editdate"],
			Number(Math.floor(Date.parse(source["@_editdate"]) / 1000)),
			Number(source["@_thumbs"]),
			text,
			is_bin,
			bid
		);
	}

	private static findBidNumber(text: string): number | undefined {
		const bid = ItemCommentProcessor.findBidText(text);
		if (bid) {
			const bidNumber = Number(bid);
			if (bidNumber < 1000) {
				// dirty sanity check. should fix this properly in regex
				return bidNumber;
			}
		}
		return undefined;
	}

	private static findBidText(text: string): string | undefined {
		let bid = extractString(text, /(?:€\s*(\d+))|(?:(\d+)\s*€)/i);
		if (bid) return bid;

		bid = extractString(
			text,
			/(?:\b(?:euros?)\s*(\d+))|(?:(\d+)\s*(?:euros?))\b/i
		);
		if (bid) return bid;

		bid = extractString(text, /(?:\b[E]\s*(\d+))|(?:(\d+)\s*[E]\b)/i);
		if (bid) return bid;

		bid = extractString(text, /(?:\b(\d+)\b)/);
		if (bid) return bid;

		return undefined;
	}
}
