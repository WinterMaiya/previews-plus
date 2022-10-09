import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useReducer, useState } from "react";
import { Modal } from "react-bootstrap";
import grabMovieDataInitialize from "../../components/helper-functions/grabMovieDataInitialize.js";
import { prisma } from "../../components/helper-functions/prisma";
import DashboardHome from "../../components/react-components/DashboardHome";
import MovieCarousel from "../../components/react-components/MovieCarousel";
import MovieModal from "../../components/react-components/MovieModal";
import NavBar from "../../components/react-components/NavBar";
import InfoComponent from "../../components/react-components/InfoComponent.jsx";

const ProfileDashboard = ({
	session,
	watchProfile,
	checkUser,
	movieData,
	watchList,
}) => {
	// TODO: make the like buttons work
	// TODO: add tests
	// TODO: create info page
	// TODO: add TMDBMovieID brands
	// Toggles what is shown to the user. Home, Searching, Movies, TvShows, Loading, Info
	const [pageComponents, setPageComponents] = useState("Home");
	const [searching, setSearching] = useState("");
	const [searchData, setSearchData] = useState();
	const [dashboardState, setDashboardState] = useState("Home");
	const MOVIE_DATA = movieData;
	console.log(MOVIE_DATA, "Movie Data for debuging");
	console.log(watchProfile, "Watch Profile");

	const reducer = (state, action) => {
		// Reducer for the movieList state
		if (action.type === "update") {
			// Updates the state of movieList
			const toSet = { results: [action.payload, ...state.results] };
			return toSet;
		}
		if (action.type === "delete") {
			// Delete an item from the state of movieList
			// Create a temporary new array
			const temp = { results: [...state.results] };
			for (let i in state.results) {
				if (state.results[i].id == action.payload) {
					// Can't make this === as the result and the payload are different types
					temp.results.splice(i, 1);
					return temp;
				}
			}
			console.error("Item does not exist in list");
			return temp;
		}
	};
	const [movieList, movieListDispatch] = useReducer(
		reducer,
		MOVIE_DATA.watchList
	);

	// Hooks and helper function for the movie Modal
	const [movieModalData, setMovieModalData] = useState({
		movie: { title: "Title" },
	});
	const [movieModalLoading, setMovieModalLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	useEffect(() => {
		// This is to make sure that JS from bootstrap gets loaded into the browser
		require("bootstrap/dist/js/bootstrap.bundle.min.js");
	}, []);

	const grabMovieData = async (movie) => {
		// Grabs the data for the movie video from the api.
		// Return videos which have a trailer and sets the MovieModal hooks
		try {
			setMovieModalLoading(true);
			let data;
			if (movie.media_type === undefined) {
				// If the media_type doesn't exist abort and close the modal
				console.error("Could not grab media data!");
				setMovieModalData({
					movie: { title: "Title" },
				});
				closeModal();
				setMovieModalLoading(false);
				return false;
			} else {
				if (movie.media_type === "movie") {
					const result = await axios.get(`/api/movies/video/movie/${movie.id}`);
					data = result.data;
				} else if (movie.media_type === "tv") {
					const result = await axios.get(`/api/movies/video/tv/${movie.id}`);
					data = result.data;
					movie.title = movie.name;
				}
				const res = [];
				for (let i of data.data.results) {
					// Only grab videos that have a type of Trailer, and are from youtube
					if (i.type === "Trailer" && i.site === "YouTube") {
						res.push(i);
					}
				}
				setMovieModalData({ movie, video: res });
				setMovieModalLoading(false);
			}
		} catch (e) {
			console.error(e);
			setShowModal(false);
		}
	};

	useEffect(() => {
		// If someone is searching change the page and fetch search results.
		// Otherwise return the user to home page
		if (searching) {
			setPageComponents("Loading");
			try {
				const fetchData = async () => {
					const { data } = await axios.get(`/api/movies/search/${searching}`);
					const res = data.data;
					setSearchData(res);
				};
				fetchData();
			} catch (e) {
				console.error(e);
			}
		} else {
			setPageComponents("Home");
		}
	}, [searching]);

	useEffect(() => {
		// This hook double checks that something is being searched by the user.
		if (searching) {
			setPageComponents("Searching");
		} else {
			setPageComponents("Home");
		}
	}, [searchData]);

	return (
		<div
			className="bg-dark text-white bg-gradient-reverse
		"
		>
			<Head>
				<title>{`${watchProfile.name}'s Dashboard`}</title>
			</Head>
			<div id="state-trackers">
				<div hidden data-testid="pageComponents">
					{pageComponents}
				</div>
			</div>
			<div className="navbar-margin">
				<NavBar
					searching={searching}
					setSearching={setSearching}
					session={session}
					user={checkUser}
					setDashboardState={setDashboardState}
					watchProfile={watchProfile}
					setPageComponents={setPageComponents}
				/>
			</div>

			{pageComponents === "Info" && <InfoComponent />}
			{pageComponents === "Loading" && (
				<section className="container my-2 align-self-center position-absolute top-50 start-50 translate-middle">
					<div className="text-center ">
						<span className="visually-hidden">Loading...</span>
					</div>
				</section>
			)}
			{pageComponents === "Home" && (
				<DashboardHome
					MOVIE_DATA={MOVIE_DATA}
					grabMovieData={grabMovieData}
					openModal={openModal}
					watchProfile={watchProfile}
					watchList={watchList}
					movieList={movieList}
					movieListDispatch={movieListDispatch}
					dashboardState={dashboardState}
				/>
			)}
			{pageComponents === "Searching" && (
				<section className="container my-2 align-self-center position-absolute top-50 start-50 translate-middle">
					{searchData !== undefined ? (
						<div className="row">
							<div className="col">
								<MovieCarousel
									movies={searchData}
									title={searching}
									grabMovieData={grabMovieData}
									openModal={openModal}
									watchProfile={watchProfile}
								/>
							</div>
						</div>
					) : (
						<div className="text-white display-2 my-5">No Results Found</div>
					)}
				</section>
			)}
			{/* Modal for watching previews. Opens when a user clicks on a movie poster */}
			<Modal show={showModal} onHide={closeModal} fullscreen={true}>
				<MovieModal
					movieModalLoading={movieModalLoading}
					closeModal={closeModal}
					movieModalData={movieModalData}
					MOVIE_DATA={MOVIE_DATA}
					watchProfile={watchProfile}
					movieList={movieList}
					movieListDispatch={movieListDispatch}
				/>
			</Modal>
		</div>
	);
};

export async function getServerSideProps({ req, query, res }) {
	const session = await getSession({ req });
	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	const watchProfile = await prisma.WatchProfile.findFirst({
		where: {
			id: query.profile,
		},
		include: { list: true, watched: true },
	});
	if (!watchProfile) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}
	const checkUser = await prisma.user.findFirstOrThrow({
		where: {
			email: session.user.email,
		},
	});
	if (!checkUser || watchProfile.userId !== checkUser.id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	try {
		// Grab all the initial movie data from the API
		const movieData = await grabMovieDataInitialize();

		let watchList = await prisma.list.findFirst({
			where: {
				watchProfileId: watchProfile.id,
			},
			include: { movies: true },
		});

		if (!watchList) {
			// If watchlist doesn't exist, create it.
			watchList = await prisma.list.create({
				data: {
					name: "Watchlist",
					watchProfileId: watchProfile.id,
				},
			});
		}

		movieData.watchList = { results: [] };
		for (let mov of watchList.movies) {
			// Add movies to the watchlist
			if (mov.typeOf === "movie") {
				const { data } = await axios.get(
					`https://api.themoviedb.org/3/movie/${mov.TMDBMovieID}?api_key=${process.env.TMDB_API_KEY}`
				);
				// Must push a media_type as the data does not include it
				data.media_type = mov.typeOf;
				movieData.watchList.results.unshift(data);
			} else {
				const { data } = await axios.get(
					`https://api.themoviedb.org/3/tv/${mov.TMDBMovieID}?api_key=${process.env.TMDB_API_KEY}`
				);
				data.media_type = mov.typeOf;
				movieData.watchList.results.unshift(data);
			}
		}

		const userPreference = () => {
			watchProfile.preference = { movie: {}, tv: {} };
			// Adds a preference which is an object with the genre ids as the key
			// and the value relating to how many time the movie appeared.
			// If the rating is 1 don't add it. If the rating is 0 add 1
			// If the rating is 2 or 3 and 2 or 3
			// This will make that genre appear higher in the preferences
			for (let mov of watchProfile.watched) {
				if (mov.rating !== 1) {
					let genreArr = mov.genre.split(",");
					// Checks the type of then iterates through the genres.
					// For the API there can be at most 3 genres per movie/tvshow
					if (mov.typeOf === "movie") {
						for (let genre of genreArr) {
							if (!watchProfile.preference.movie[genre]) {
								watchProfile.preference.movie[genre] = 1;
							} else {
								watchProfile.preference.movie[genre]++;
							}
						}
					}
					if (mov.typeOf === "tv") {
						for (let genre of genreArr) {
							if (!watchProfile.preference.tv[genre]) {
								watchProfile.preference.tv[genre] = 1;
							} else {
								watchProfile.preference.tv[genre]++;
							}
						}
					}
				}
			}
		};
		userPreference();

		return {
			props: {
				session,
				watchProfile,
				checkUser,
				movieData,
				watchList,
			},
		};
	} catch (e) {
		return res.status(500);
	}
}

export default ProfileDashboard;
