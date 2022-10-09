import { prisma } from "../../../components/helper-functions/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
	// Checks to make sure the user is logged in
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ message: "Unauthorized" });
	}
	if (req.method === "POST") {
		// If the request is a POST request, create a new watchProfile
		// and return the watchProfile ID

		try {
			const user = await prisma.user.findFirstOrThrow({
				where: {
					email: session.user.email,
				},
			});
			let watchProfile = {
				name: req.body.name,
				profile_pic: req.body.profile_pic,
				userId: user.id,
			};
			const create = await prisma.WatchProfile.create({ data: watchProfile });

			// Create the default Watchlist for the user
			let watchList = {
				name: "Watchlist",
				watchProfileId: create.id,
			};
			const createWatchList = await prisma.list.create({ data: watchList });
			return res.status(200).json({ data: create });
		} catch (e) {
			console.error(e);
			return res.status(412).json({ error: e });
		}
	}

	return res.status(400).json({ message: "Invalid Request" });
}
