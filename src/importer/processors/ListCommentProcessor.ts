import { ListComment } from "@prisma/client";
import { decode } from "html-entities";
import prisma from "../../prismaClient";
import { Result, ok } from "../util/result";

export class ListCommentProcessor {
	public static async update(
		listId: number,
		source: Record<string, any>
	): Promise<Result<ListComment, String>> {
		const comment = await prisma.listComment.create({
			data: {
				listId,
				username: decode(source["@_username"]),
				date: source["@_date"],
				postDate: new Date(source["@_postdate"]),
				editDate: new Date(source["@_editdate"]),
				editTimestamp: Math.floor(Date.parse(source["@_editdate"]) / 1000),
				thumbs: Number(source["@_thumbs"]),
				text: decode(`${source["#text"]}`), // force this to be a string, for parsing purposes.
			},
		});

		return ok(comment);
	}
}
