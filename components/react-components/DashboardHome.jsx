import axios from "axios";
import { useEffect, useState } from "react";
import MovieBanner from "./MovieBanner";
import MovieCarousel from "./MovieCarousel";

const DashboardHome = ({
	MOVIE_DATA,
	grabMovieData,
	openModal,
	watchProfile,
	movieList,
	movieListDispatch,
	dashboardState,
}) => {
	const [preferenceListMovie, setPreferenceListMovie] = useState([]);
	const [preferenceListTv, setPreferenceListTv] = useState([]);

	const userPopularityFirst = async (watchProfile) => {
		// Organizes the recommended movies and shows in the preference the watchProfile has selected
		// We then send a request to the api to grab the movie data and change the movie state
		const { movie, tv } = watchProfile.preference;
		let movieArr;
		let tvArr;

		// Makes sure the state is empty before sending data
		setPreferenceListMovie([]);
		setPreferenceListTv([]);

		const getGenreTitle = (genreId, genres) => {
			// Grabs the genre title using the genre id and the list of genres from
			// MOVIE_DATA.movie.genres || MOVIE_DATA.tv.genres
			for (let genre of genres) {
				if (genre.id == genreId) {
					return `${genre.name}`;
				}
			}
			return "none";
		};

		const removeGenre = (genre, genreList) => {
			// Find the correct genre in the genre list and return the index
			for (let i in genreList) {
				if (genreList[i].id == genre) {
					return i;
				}
			}
			return -1;
		};

		try {
			// Run through movies first
			let finalArr = [];
			// This allows us to remove genres as we go through them
			let tempGenre = [...MOVIE_DATA.movie.genres];
			if (movie) {
				movieArr = Object.entries(movie).sort((a, b) => b[1] - a[1]);
				for (let genreId of movieArr) {
					// genreId is a list with two numbers
					// [The actual ID of the genre in TMDB, The User Preference of the genre]
					// Remove ID's from the temp list so we can grab the rest of the movies later
					let removeId = removeGenre(genreId[0], tempGenre);
					tempGenre.splice(removeId, 1);

					let { data } = await axios.get("/api/movies/", {
						params: { movie: genreId[0], type: "genreMovie" },
					});
					// Grab the title of the genre
					let title = getGenreTitle(genreId[0], MOVIE_DATA.movie.genres);
					// Push both the title and the genre so we can dynamically setup the movie options
					finalArr.push({
						data,
						title,
					});
				}
			}
			for (let genre of tempGenre) {
				let { data } = await axios.get("/api/movies/", {
					params: { movie: genre.id, type: "genreMovie" },
				});
				finalArr.push({ data, title: genre.name });
			}
			setPreferenceListMovie([...preferenceListMovie, ...finalArr]);

			// Run through TV second
			finalArr = [];
			tempGenre = [...MOVIE_DATA.tv.genres];
			if (tv) {
				tvArr = Object.entries(tv).sort((a, b) => b[1] - a[1]);

				for (let genreId of tvArr) {
					let removeId = removeGenre(genreId[0], tempGenre);
					tempGenre.splice(removeId, 1);
					let { data } = await axios.get("/api/movies/", {
						params: { movie: genreId[0], type: "genreTv" },
					});
					let title = getGenreTitle(genreId[0], MOVIE_DATA.tv.genres);
					finalArr.push({
						data,
						title,
					});
				}
			}
			for (let genre of tempGenre) {
				let { data } = await axios.get("/api/movies/", {
					params: { movie: genre.id, type: "genreTv" },
				});
				finalArr.push({ data, title: genre.name });
			}
			setPreferenceListTv([...preferenceListTv, ...finalArr]);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		setPreferenceListMovie([]);
		setPreferenceListTv([]);
		userPopularityFirst(watchProfile);
	}, []);

	// Creates the component for the main homepage.
	// dashboardState will have 3 options: "home", "movies", "tv"
	// These will change what movies are shown
	return (
		<section id="Home" className="my-5">
			<div className={`container-fluid`}>
				<div className={dashboardState !== "Home" ? "d-none" : "d-block"}>
					<MovieBanner
						movie={MOVIE_DATA.trending.results[0]}
						MOVIE_DATA={MOVIE_DATA}
						grabMovieData={grabMovieData}
						openModal={openModal}
						movieList={movieList}
						movieListDispatch={movieListDispatch}
						watchProfile={watchProfile}
					/>
				</div>
			</div>
			<div className="container text-center pt-5 mt-5">
				<div
					className={`row ${dashboardState !== "Home" ? "d-none" : "d-block"}`}
				>
					<div className="col">
						<MovieCarousel
							movies={MOVIE_DATA.trending}
							title={"What's Popular"}
							grabMovieData={grabMovieData}
							openModal={openModal}
							watchProfile={watchProfile}
						/>
					</div>
				</div>
				<div
					className={`row ${dashboardState !== "Home" ? "d-none" : "d-block"}`}
				>
					{movieList.results[0] && (
						<div className="col">
							<MovieCarousel
								movies={movieList}
								title={"My List"}
								grabMovieData={grabMovieData}
								openModal={openModal}
								watchProfile={watchProfile}
							/>
						</div>
					)}
				</div>
				<div
					className={`row ${dashboardState === "Movie" ? "d-none" : "d-block"}`}
				>
					<div className="col">
						<MovieCarousel
							movies={MOVIE_DATA.tv.popular}
							title={"Trending Shows"}
							grabMovieData={grabMovieData}
							openModal={openModal}
							watchProfile={watchProfile}
						/>
					</div>
				</div>
				<div
					className={`row ${dashboardState === "Tv" ? "d-none" : "d-block"}`}
				>
					<div className="col">
						<MovieCarousel
							movies={MOVIE_DATA.movie.popular}
							title={"Trending Movies"}
							grabMovieData={grabMovieData}
							openModal={openModal}
							watchProfile={watchProfile}
						/>
					</div>
				</div>
				{preferenceListMovie.length > 0 && (
					<div>
						{preferenceListMovie.map((e) => {
							e.data.media_type = "movie";
							return (
								<div
									className={`row ${
										dashboardState === "Tv" ? "d-none" : "d-block"
									}`}
								>
									<div className="col">
										<MovieCarousel
											movies={e.data}
											title={`${e.title} Movies`}
											key={`${e.title} Movies`}
											grabMovieData={grabMovieData}
											openModal={openModal}
											watchProfile={watchProfile}
										/>
									</div>
								</div>
							);
						})}
					</div>
				)}
				{preferenceListTv.length > 0 && (
					<div>
						{preferenceListTv.map((e) => {
							e.data.media_type = "tv";
							return (
								<div
									className={`row ${
										dashboardState === "Movie" ? "d-none" : "d-block"
									}`}
								>
									<div className="col">
										<MovieCarousel
											movies={e.data}
											title={`${e.title} Shows`}
											key={`${e.title} Shows`}
											grabMovieData={grabMovieData}
											openModal={openModal}
											watchProfile={watchProfile}
										/>
									</div>
								</div>
							);
						})}
					</div>
				)}

				<div
					className={`row ${dashboardState !== "Home" ? "d-none" : "d-block"}`}
				>
					<div className="col">
						<MovieCarousel
							movies={MOVIE_DATA.trendingWeekly}
							title={"Trending this Week"}
							openModal={openModal}
							grabMovieData={grabMovieData}
							watchProfile={watchProfile}
						/>
					</div>
				</div>
				{preferenceListTv.length === 0 && (
					<div className="text-center ">
						<div
							className="spinner-border text-primary watch-profile-loading"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
						<h5 className="display-5 text-primary">Grabbing all Shows...</h5>
					</div>
				)}
			</div>
		</section>
	);
};

export default DashboardHome;
