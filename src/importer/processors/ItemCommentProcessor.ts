import { decode } from "html-entities";
import { extractString, removeQuoted, removeStrikethrough } from "../util/util";

export class ItemCommentProcessor {
	public static parseData(itemId: number, source: Record<string, any>) {
		const text = decode(`${source["#text"]}`); // force this to be a string, for parsing purposes.

		let is_bin = false;
		let bid = null;
		if (text.length != 0) {
			let stripped = removeStrikethrough(text);
			stripped = removeQuoted(stripped);
			is_bin = !!extractString(stripped, /\b(bin)\b/i);
			bid = ItemCommentProcessor.findBidNumber(stripped);
		}

		return {
			itemId: itemId,
			username: decode(source["@_username"]),
			date: source["@_date"],
			postDate: new Date(source["@_postdate"]),
			postTimestamp: Number(
				Math.floor(Date.parse(source["@_postdate"]) / 1000)
			),
			editDate: new Date(source["@_editdate"]),
			editTimestamp: Number(
				Math.floor(Date.parse(source["@_editdate"]) / 1000)
			),
			thumbs: Number(source["@_thumbs"]),
			text: text,
			isBin: is_bin,
			bid: bid,
		};
	}

	private static findBidNumber(text: string): number | null {
		const bid = ItemCommentProcessor.findBidText(text);
		if (bid) {
			const bidNumber = Number(bid);
			if (bidNumber < 1000) {
				// dirty sanity check. should fix this properly in regex
				return bidNumber;
			}
		}
		return null;
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
