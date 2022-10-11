import { getSession } from "next-auth/react";
import { prisma } from "../../../../components/helper-functions/prisma";
// Takes the movie Id and adds it to the users watched history
export default async function handler(req, res) {
	// Checks to make sure the user is logged in
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ message: "Unauthorized" });
	}
	const { movieId } = req.query;
	const { params } = req.body;
	const { profile, movieTitle, moviePoster, typeOf, genre } = params;
	if (!typeOf) {
		// Status 422(Unprocessable Entity) when the parameters are invalid
		return res.status(422).json({ message: "Incorrect Parameters" });
	}
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
		});
		const watched = await prisma.watched.findFirst({
			where: {
				watchProfileId: watchProfile.id,
				title: movieTitle,
			},
		});
		if (req.method === "PUT") {
			// Add the movie to the users watched if it exists.
			if (!watched) {
				const newWatched = await prisma.watched.create({
					data: {
						TMDBMovieID: movieId,
						title: movieTitle,
						watchProfileId: profile,
						picture_ref: moviePoster,
						typeOf,
						genre: `${genre}`,
					},
				});
				if (newWatched) {
					return res
						.status(201)
						.json({ message: "Success", status: "Added Video to Watched" });
				}
			}
			return res
				.status(200)
				.json({ message: "Success", status: "Video already exists" });
		}
	} catch (e) {
		console.error(e);
		return res.status(404).json({ message: e });
	}
}
