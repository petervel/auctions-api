// import { AuctionListProcessor } from "./processors/AuctionListProcessor";
// import { AuctionItemProcessor } from "./processors/AuctionItemProcessor";
// import { Auction } from "../../data-model/auction";
// import { allSettledWithRetries } from "./util";
// import { getAuctionDataFromBgg, ProcessingResultEnum } from "./bggUtil";

import { Fair } from "../../model/fair";

export const updateData = async () => {
	console.log("update data");
	const fairs = await Fair.all();
	console.log(fairs);

	// const promises = [];
	// for (const fair of fairs) {
	// 	// promises.push(checkAuction(fair));
	// }
	// await allSettledWithRetries(promises);
};

// async function checkAuction(auction: Auction) {
// 	if (shouldSkip(auction)) {
// 		return;
// 	}

// 	console.info(`${auction.id}: Processing list`);

// 	const auctionRef = db.ref(`fairs/${auction.id}`);

// 	const startTimestamp = Date.now();

// 	await auctionRef.update({ last_run: startTimestamp, last_result: "running" });

// 	let afterTimestamp = 0;
// 	if (auction.updated_until != undefined) {
// 		afterTimestamp = auction.updated_until - 3600 * 1000; // better to be safe than miss data.
// 	}

// 	console.info(`${auction.id}: Processing after timestamp ${afterTimestamp}, (${new Date(afterTimestamp)})`);

// 	const result = await processAuction(auction, afterTimestamp);

// 	console.info(`${auction.id}: Finished processing list, result: ${result.result}`);

// 	await auctionRef.update({
// 		last_result: result.result,
// 		updated_until: result.updatedUntil ?? startTimestamp,
// 	});
// 	console.info(`${auction.id}: updated auction.`);
// }

// interface ProcessingResult {
// 	result: ProcessingResultEnum;
// 	updatedUntil?: number;
// }

// // Main data function
// async function processAuction(auction: Auction, afterTimestamp: number): Promise<ProcessingResult> {
// 	const result = await getAuctionDataFromBgg(auction);
// 	if (typeof result == "string") return { result };

// 	console.info(`${auction.id}: Saving auction list object...`);
// 	await AuctionListProcessor.save(result.list, afterTimestamp);

// 	let items = result.items.filter((item) =>
// 		item._edit_timestamp == undefined || item._edit_timestamp >= afterTimestamp
// 	);
// 	console.info(`${auction.id}: Preparing to save items...`);
// 	const processingResult: ProcessingResult = { result: "success" };
// 	const maxItems = 1000;
// 	if (items.length > maxItems) {
// 		// too many, just do roughly the next 1000
// 		items = items.sort((a, b) => (a._edit_timestamp ?? 0) - (b._edit_timestamp ?? 0));

// 		const updatedUntil = items[maxItems - 1]._edit_timestamp ?? 0;
// 		console.info(`${auction.id}: Too many unsaved items. Only saving items up to ${new Date(updatedUntil)}.`);
// 		items = items.filter((item) => (item._edit_timestamp ?? 0) <= updatedUntil);
// 		processingResult.updatedUntil = updatedUntil;
// 	}

// 	console.info(`${auction.id}: Creating save promises for ${items.length} items...`);
// 	let promises: Promise<void>[] = [];
// 	for (const item of items) {
// 		promises = promises.concat(AuctionItemProcessor.save(auction.id, item));
// 	}

// 	console.info(`${auction.id}: Saving ${promises.length} item promises...`);
// 	await allSettledWithRetries(promises);

// 	console.info(`${auction.id}: All save promises completed.`);

// 	return processingResult;
// }

// function shouldSkip(auction: Auction): boolean {
// 	if (!auction.last_run) {
// 		return false;
// 	}

// 	if (auction.status == "archived") {
// 		return true;
// 	}

// 	const minsAgo = Math.round((Date.now() - auction.last_run) / (60 * 1000));
// 	switch (auction.last_result) {
// 		case "success":
// 			switch (auction.status) {
// 				case "active":
// 					if (minsAgo < 15) {
// 						console.log(`${auction.id}: Last succesful run was only ${minsAgo} minutes ago. Skipping.`);
// 						return true;
// 					}
// 					break;
// 				case "expired":
// 					if (minsAgo < 24 * 60) {
// 						console.log(`${auction.id} (archived): Last succesful run was only ${Math.round(minsAgo / 60)} hours ago. Skipping.`);
// 						return true;
// 					}
// 					break;
// 			}
// 			break;
// 		case "failed":
// 			if (minsAgo <= 90) {
// 				console.log(`${auction.id}: Ran with error ${minsAgo} minutes ago. Skipping.`);
// 				return true;
// 			}
// 			break;
// 		case "running":
// 			if (minsAgo <= 30) {
// 				console.log(`${auction.id}: Still be running after ${minsAgo} minutes. Skipping.`);
// 				return true;
// 			}
// 			break;
// 	}
// 	return false;
// }
