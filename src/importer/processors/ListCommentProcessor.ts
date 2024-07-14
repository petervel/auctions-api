import { decode } from "html-entities";

export class ListCommentProcessor {
	public static parseData(listId: number, source: Record<string, any>) {
		return {
			listId,
			username: decode(source["@_username"]),
			date: source["@_date"],
			postDate: new Date(source["@_postdate"]),
			postTimestamp: Math.floor(Date.parse(source["@_postdate"]) / 1000),
			editDate: new Date(source["@_editdate"]),
			editTimestamp: Math.floor(Date.parse(source["@_editdate"]) / 1000),
			thumbs: Number(source["@_thumbs"]),
			text: decode(`${source["#text"]}`), // force this to be a string, for parsing purposes.
		};
	}
}
