import { getSession } from "next-auth/react";
import axios from "axios";
// Grabs the movie recommendations and discovery.
export default async function handler(req, res) {
	// Checks to make sure the user is logged in
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ message: "Unauthorized" });
	}
	const { movie, type } = req.query;
	try {
		if (req.method === "GET") {
			// Grab the recommendations based on the type query parameter
			if (type === "genreMovie") {
				const { data } = await axios.get(
					`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${movie}`
				);

				return res.status(200).json(data);
			}
			if (type === "genreTv") {
				const { data } = await axios.get(
					`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${movie}`
				);

				return res.status(200).json(data);
			}
			// Status 422(Unprocessable Entity) when the parameters are invalid
			return res.status(422).json({ message: "Incorrect Parameters" });
		}
		return res
			.status(405)
			.json({ success: false, message: "Method not allowed" });
	} catch (e) {
		console.error(e);
		return res.status(404).json({ message: e });
	}
}
