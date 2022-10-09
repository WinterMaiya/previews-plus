import { prisma } from "../../../components/helper-functions/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
	// Checks to make sure the user is logged in
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ message: "Unauthorized" });
	}
	const { id } = req.query;
	if (req.method === "DELETE") {
		// If the request is a DELETE request, delete that watchProfile and

		try {
			const user = await prisma.user.findFirstOrThrow({
				where: {
					email: session.user.email,
				},
			});
			const watchProfile = await prisma.watchProfile.findFirstOrThrow({
				where: {
					id,
					userId: user.id,
				},
			});

			// Create cascade for prisma to delete
			// Should go in order: Lists, Watched, WatchProfile
			const deletePlaylists = prisma.list.deleteMany({
				where: {
					watchProfileId: watchProfile.id,
				},
			});
			const deleteWatched = prisma.list.deleteMany({
				where: {
					watchProfileId: watchProfile.id,
				},
			});
			const deleteWatchProfile = prisma.watchProfile.deleteMany({
				where: {
					id,
				},
			});

			await prisma.$transaction([
				deletePlaylists,
				deleteWatched,
				deleteWatchProfile,
			]);

			return res
				.status(200)
				.json({ message: "Successfully Deleted Watch Profile" });
		} catch (e) {
			console.error(e);
			return res.status(412).json({ error: e });
		}
	}

	return res.status(400).json({ message: "Invalid Request" });
}
