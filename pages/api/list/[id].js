import { getSession } from "next-auth/react";
import { prisma } from "../../../components/helper-functions/prisma";
// Takes the movie Id and adds it to the users watchList.
export default async function handler(req, res) {
	// Checks to make sure the user is logged in
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ message: "Unauthorized" });
	}
	const { id, profile, movieTitle, moviePoster, typeOf } = req.query;
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
			// Add the movie to the users watchList if it exists.
			const watched = await prisma.watched.findFirst({
				where: {
					watchProfileId: watchProfile.id,
					TMDBMovieID: id,
				},
			});
			if (watched) {
				const updateWatched = await prisma.watched.update({
					where: {
						id: watched.id,
					},
					data: {
						listId: watchProfile.list[0].id,
					},
				});
				return res.status(200).json(updateWatched);
			}
			const newWatched = await prisma.watched.create({
				data: {
					TMDBMovieID: movieId,
					title: movieTitle,
					watchProfileId: profile,
					listId: watchProfile.list[0].id,
					picture_ref: moviePoster,
					typeOf,
				},
			});
			return res.status(201).json(newWatched);
		}

		if (req.method === "GET") {
			// Grab the list and all the movies
			const list = await prisma.list.findFirstOrThrow({
				where: {
					id: watchProfile.list[0].id,
				},
				include: { movies: true },
			});
			console.log(list);
			return res.status(200).json(list);
		}

		if (req.method === "DELETE") {
			// Delete method wont delete an item because it still needs to be tracked by the user watched.
			// Delete will instead remove the listID, deleting the connection between the items
			const watched = await prisma.watched.findFirst({
				where: {
					watchProfileId: watchProfile.id,
					TMDBMovieID: id,
				},
			});
			if (watched) {
				const updateWatched = await prisma.watched.update({
					where: {
						id: watched.id,
					},
					data: {
						listId: null,
					},
				});
				if (updateWatched) {
					return res.status(200).json({ message: "Success", id });
				}
			}
			return res.status(404).json({ message: "Not Found" });
		}
	} catch (e) {
		console.error(e);
		return res.status(400).json({ message: e });
	}
}
