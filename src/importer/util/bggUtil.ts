// import { XMLParser } from "fast-xml-parser";
// import got from "got";

// import { AuctionItemProcessor } from "./processors/AuctionItemProcessor";
// import { AuctionListProcessor } from "./processors/AuctionListProcessor";
// import { AuctionList } from "../../data-model/auction-list";
// import { AuctionItem } from "../../data-model/auction-item";
// import { Auction } from "../../data-model/auction";

// export type AuctionData = {
// 	list: AuctionList,
// 	items: AuctionItem[];
// };
// export type ProcessingResultEnum = "success" | "not_ready" | "failed";

// export async function getAuctionDataFromBgg(auction: Auction): Promise<AuctionData | ProcessingResultEnum> {
// 	console.info(`${auction.id}: Fetching XML...`);
// 	const xmlString = await getXml(auction);

// 	console.info(`${auction.id}: Parsing XML...`);
// 	const data = parseXml(xmlString, auction.id);
// 	if (typeof data == "string") return data;

// 	console.info(`${auction.id}: Loading auction list object...`);
// 	const list = AuctionListProcessor.fromBggObject(data);

// 	console.info(`${auction.id}: Loading items...`);
// 	const itemsArray = Array.isArray(data["item"]) ? data["item"] : [data["item"]];
// 	const items: AuctionItem[] = [];
// 	for (const itemObject of itemsArray) {
// 		items.push(AuctionItemProcessor.fromBggObject(itemObject));
// 	}

// 	return { list, items };
// }

// async function getXml(auction: Auction): Promise<string> {
// 	return await got(`https://boardgamegeek.com/xmlapi/geeklist/${auction.id}?comments=1`, { resolveBodyOnly: true });
// }

// type DataObject = Record<string, any>;

// function parseXml(xmlString: string, auctionId: number): DataObject | "not_ready" | "failed" {
// 	const parser = new XMLParser({
// 		ignoreAttributes: false,
// 		attributeNamePrefix: "@_",
// 	});
// 	const obj = parser.parse(xmlString);
// 	console.info(`${auctionId}: Completed XML parse.`);

// 	if (obj["message"]) {
// 		console.log(`${auctionId}: Geeklist not ready, message from BGG: ${obj["message"]}`);
// 		return "not_ready";
// 	}

// 	if (!obj["geeklist"]) {
// 		console.warn(`${auctionId}: Unexpected response: ${JSON.stringify(obj).substring(0, 500)}`);
// 		return "failed";
// 	}
// 	return obj["geeklist"];
// }
