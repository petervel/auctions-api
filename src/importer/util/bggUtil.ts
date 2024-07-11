import { Fair, List } from "@prisma/client";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { GeekListProcessor } from "../../importer/processors/GeekListProcessor";
import { Result, err, ok } from "./result";

export async function update(fair: Fair): Promise<Result<List, String>> {
	console.info(`${fair.id}: Fetching XML... ${fair.geeklistId}`);
	const xmlString = await getXml(fair.geeklistId);

	console.info(`${fair.id}: Parsing XML...`);
	const parseResult = parseXml(fair.id, xmlString);
	if (parseResult.isErr()) return parseResult;
	const object = parseResult.value;

	console.info(`${fair.id}: Loading auction list object...`);
	const updateResult = await GeekListProcessor.update(fair.id, object);
	if (updateResult.isErr()) return updateResult;

	const list = updateResult.value;
	fair.listId = list.id;

	console.log("done.");

	return ok(list);
}

async function getXml(listId: number) {
	const url = `https://boardgamegeek.com/xmlapi/geeklist/${listId}?comments=1`;
	console.info(`fetching xml from ${url}`);
	const { data } = await axios.get(url);
	return data;
}

type DataObject = Record<string, any>;

function parseXml(
	fairId: number,
	xmlString: string
): Result<DataObject, String> {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
	});
	const obj = parser.parse(xmlString);
	console.info(`${fairId}: Completed XML parse.`);

	if (obj["message"]) {
		console.log(
			`${fairId}: Geeklist not ready, message from BGG: ${obj["message"]}`
		);
		return err("not_ready");
	}

	if (!obj["geeklist"]) {
		console.warn(
			`${fairId}: Unexpected response: ${JSON.stringify(obj).substring(0, 500)}`
		);
		return err("failed");
	}
	return ok(obj["geeklist"]);
}
