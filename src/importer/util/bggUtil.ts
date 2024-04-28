import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Fair } from "model/Fair";
import { GeekList } from "model/GeekList";
import { ListItem } from "model/ListItem";
import { GeekListProcessor } from "../../importer/processors/GeekListProcessor";

// import { AuctionItemProcessor } from "./processors/AuctionItemProcessor";
// import { AuctionListProcessor } from "./processors/AuctionListProcessor";
// import { AuctionList } from "../../data-model/auction-list";
// import { AuctionItem } from "../../data-model/auction-item";
// import { Auction } from "../../data-model/auction";

export type FairData = {
	list: GeekList;
	items: ListItem[];
};
export type ProcessingResultEnum = "success" | "not_ready" | "failed";

export async function getAuctionDataFromBgg(
	fair: Fair
): Promise<GeekList | "not_ready" | "failed"> {
	console.info(`${fair.id}: Fetching XML... ${fair.geeklist_id}`);
	const xmlString = await getXml(fair);

	console.info(`${fair.id}: Parsing XML...`);
	const data = parseXml(xmlString, fair.id);
	if (typeof data == "string") return data;

	console.info(`${fair.id}: Loading auction list object...`);
	const list = GeekListProcessor.fromBggObject(data);
	console.log("done.");

	return list;
}

async function getXml(fair: Fair) {
	const { data } = await axios.get(
		`https://boardgamegeek.com/xmlapi/geeklist/${fair.geeklist_id}?comments=1`
	);
	return data;
}

type DataObject = Record<string, any>;

function parseXml(
	xmlString: string,
	auctionId: number
): DataObject | "not_ready" | "failed" {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
	});
	const obj = parser.parse(xmlString);
	console.info(`${auctionId}: Completed XML parse.`);

	if (obj["message"]) {
		console.log(
			`${auctionId}: Geeklist not ready, message from BGG: ${obj["message"]}`
		);
		return "not_ready";
	}

	if (!obj["geeklist"]) {
		console.warn(
			`${auctionId}: Unexpected response: ${JSON.stringify(obj).substring(
				0,
				500
			)}`
		);
		return "failed";
	}
	return obj["geeklist"];
}
