import axios from "axios";
import { getSession } from "next-auth/react";

export default async function searchApi(req, res) {
	const { searchData } = req.query;
	const session = await getSession({ req });
	if (!session) {
		// If the user is not logged in
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		if (req.method === "GET") {
			const { data } = await axios.get(
				`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${searchData}`
			);
			return res.status(200).json({ data });
		}
		return res
			.status(405)
			.json({ success: false, message: "Method not allowed" });
	} catch (e) {
		console.error(e);
		return res.status(412).json({ error: e });
	}
}
