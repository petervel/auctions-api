// import { db } from "db";
// import { Fair } from "model/fair";

// export async function getFairs(includeArchived = false) {
// 	Fair.all();

// 	const snap = await db.ref("fairs").get();
// 	const fairs: Fair[] = [];
// 	snap.forEach((auctionRef) => {
// 		const auction = auctionRef.val() as Fair;
// 		if (includeArchived || auction.status != "archived") {
// 			fairs.push(auction);
// 		}
// 	});
// 	return fairs;
// }
