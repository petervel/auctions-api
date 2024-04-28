import { Fair } from "../../model/Fair";
import { getAuctionDataFromBgg } from "./bggUtil";

export const updateData = async () => {
	console.log("update data");
	const fairs = await Fair.all();
	console.log(fairs);

	// const promises = [];
	for (const fair of fairs) {
		// promises.push(checkAuction(fair));

		switch (fair.status) {
			case "active":
				processFair(fair);
				break;
			case "archived":
				break;
		}
	}
	// await allSettledWithRetries(promises);
};

const processFair = async (fair: Fair) => {
	const data = await getAuctionDataFromBgg(fair);

	if (typeof data === "string") {
		console.log("Unsuccesful: " + data);
		return;
	}

	data.save();
};
