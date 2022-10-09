import axios from "axios";
const grabMovieDataInitialize = async () => {
	// Grabs all the movie data on dashboard/watchProfile load.
	// This will grab various categories from the api which will then be sorted by the client
	const MOVIE_DATA = { movie: {}, tv: {} };

	// TODO: Condense the requests to make the program faster

	// Grab the trending data for movies and tv shows.
	const getTrendingDaily = async () => {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.TMDB_API_KEY}`
		);
		MOVIE_DATA.trending = data;
	};
	await getTrendingDaily();

	const getTrendingWeekly = async () => {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY}`
		);
		MOVIE_DATA.trendingWeekly = data;
	};
	await getTrendingWeekly();

	// Get upcoming movies in theater
	// const getUpcomingMovies = async () => {
	// 	const { data } = await axios.get(
	// 		`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`
	// 	);
	// 	MOVIE_DATA.upcomingMovies = data;
	// };
	// await getUpcomingMovies();

	const getPopularTvShows = async () => {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}`
		);
		MOVIE_DATA.tv.popular = data;
		MOVIE_DATA.tv.popular.media_type = "tv";
	};
	await getPopularTvShows();

	const getPopularMoviesShows = async () => {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
		);
		MOVIE_DATA.movie.popular = data;
		MOVIE_DATA.movie.popular.media_type = "movie";
	};
	await getPopularMoviesShows();

	// const getNowPlaying = async () => {
	// 	const { data } = await axios.get(
	// 		`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`
	// 	);
	// 	MOVIE_DATA.nowPlaying = data;
	// };
	// await getNowPlaying();

	// Grab the genres and there names from the api. Future data can call upon this.
	const getGenreListMovies = async () => {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
		);
		MOVIE_DATA.movie.genres = data.genres;
	};
	await getGenreListMovies();

	const getGenreListTv = async () => {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`
		);
		MOVIE_DATA.tv.genres = data.genres;
	};
	await getGenreListTv();

	return MOVIE_DATA;
};

export default grabMovieDataInitialize;
