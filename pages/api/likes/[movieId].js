import { getSession } from "next-auth/react";
import { prisma } from "../../../components/helper-functions/prisma";
// Takes the movie Id and adds it to the users watchList.
export default async function handler(req, res) {
	// Checks to make sure the user is logged in
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}
	const { movieId, profile, rating } = req.query;

	try {
		const user = await prisma.user.findFirstOrThrow({
			where: {
				email: session.user.email,
			},
		});
		const watchProfile = await prisma.WatchProfile.findFirstOrThrow({
			where: {
				id: profile,
				userId: user.id,
			},
			include: { watched: true, list: true },
		});

		if (req.method === "PUT") {
			// Add the rating to the users watched list
			const watched = await prisma.watched.findFirst({
				where: {
					watchProfileId: watchProfile.id,
					TMDBMovieID: movieId,
				},
			});
			if (watched) {
				const updateWatched = await prisma.watched.update({
					where: {
						id: watched.id,
					},
					data: {
						rating: parseInt(rating),
					},
				});
				return res.status(200).json({ success: true, data: updateWatched });
			}
			return res
				.status(412)
				.json({ success: false, message: "Movie doesn't exist" });
		}
		if (req.method === "GET") {
			//Grab the users rating for the movie
			const watched = await prisma.watched.findFirst({
				where: {
					watchProfileId: watchProfile.id,
					TMDBMovieID: movieId,
				},
			});
			if (watched) {
				return res.status(200).json({ success: true, data: watched.rating });
			}
			return res
				.status(412)
				.json({ success: false, message: "Movie doesn't exist" });
		}
		return res
			.status(405)
			.json({ success: false, message: "Method not allowed" });
	} catch (e) {
		console.error(e);
		return res.status(400).json({ success: false, message: e });
	}
}
