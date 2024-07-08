import prisma from "../../prismaClient";
import { update } from "./bggUtil";

export const updateData = async () => {
	console.log("Update data");
	const fairs = await prisma.fair.findMany({ where: { status: "ACTIVE" } });

	console.log(fairs);

	for (const fair of fairs) {
		const result = await update(fair);
		if (result.isErr()) {
			console.log(`Processing fair ${fair.id} unsuccesful: ${result.error}`);
		} else {
			console.log(`"${fair.name}" successfully updated.`);
		}
	}
};
