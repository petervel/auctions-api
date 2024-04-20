// import { db, myFunctions } from "./init";
// import { AuctionItem } from "../../data-model/auction-item";
// import { getAuctions } from "./dbUtil";
// import { Auction } from "../../data-model/auction";
// import { getAuctionDataFromBgg } from "./bggUtil";
// import { allSettledWithRetries } from "./util";

// export const removeDeleted = myFunctions
// 	.pubsub.schedule("every 6 hours")
// 	.onRun(async () => {
// 		const auctions = await getAuctions();

// 		const promises = [];
// 		for (const auction of auctions) {
// 			promises.push(removeDeletedFromAuction(auction));
// 		}
// 		await allSettledWithRetries(promises);
// 	});

// async function removeDeletedFromAuction(auction: Auction) {
// 	const currentTime = Date.now();
// 	await markAllItemsSeen(auction, currentTime);

// 	const expireTime = currentTime - 86400000; // not seen for 24 hours
// 	const items = await db.ref(`auction_items/${auction.id}`).orderByChild("_last_seen").endBefore(expireTime).once("value");
// 	const promises: Promise<void>[] = [];
// 	items.forEach((item) => {
// 		const itemData = item.val() as AuctionItem;
// 		if (itemData.deleted) {
// 			return;
// 		}
// 		console.info(`${auction.id}: found deleted item: ${itemData.id}`);
// 		promises.push(item.ref.child("deleted").set(true));
// 		const dataRef = db.ref(`auction_item_views/${auction.id}/${itemData.id}`);
// 		promises.push(dataRef.remove());
// 	});

// 	console.log(`${auction.id}: persisting all deletions.`);
// 	await allSettledWithRetries(promises);
// 	console.log(`${auction.id}: all done.`);
// }

// async function markAllItemsSeen(auction: Auction, currentTime: number) {
// 	const data = await getAuctionDataFromBgg(auction);
// 	if (typeof data == "string") {
// 		console.info(`${auction.id}: Processing problem: ${data}`);
// 		return;
// 	}

// 	console.log(`${auction.id}: Marking all items seen.`);
// 	const items = data.items;
// 	const promises: Promise<void>[] = [];
// 	for (const item of items) {
// 		promises.push(markItemSeen(auction, item, currentTime));
// 	}
// 	await allSettledWithRetries(promises);
// 	console.log(`${auction.id}: all items marked seen.`);
// }

// async function markItemSeen(auction: Auction, item: AuctionItem, currentTime: number): Promise<void> {
// 	return await db.ref(`auction_items/${auction.id}/${item.id}`).update({ "_last_seen": currentTime });
// }
