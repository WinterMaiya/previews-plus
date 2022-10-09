import axios from "axios";
import { getSession } from "next-auth/react";

export default async function searchApi(req, res) {
	const { id } = req.query;
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
		);
		return res.status(200).json({ data });
	} catch (e) {
		console.error(e);
		return res.status(412).json({ error: e });
	}
}
