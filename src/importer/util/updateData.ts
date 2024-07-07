import prisma from "../../prismaClient";
import { update } from "./bggUtil";

export const updateData = async () => {
	console.log("Update data");
	const fairs = (await prisma.fair.findMany()).filter((fair) => {
		if (!fair.listId) {
			console.log(`Skipping fair ${fair.id} without list.`);
			return false;
		}
		return true;
	});

	console.log(fairs);

	for (const fair of fairs) {
		switch (fair.status) {
			case "ACTIVE":
				const result = await update(fair);

				if (result.isErr()) {
					console.log(
						`Processing fair ${fair.id} unsuccesful: ${result.error}`
					);
				}
				break;
			case "ARCHIVED":
				break;
		}
	}
};
