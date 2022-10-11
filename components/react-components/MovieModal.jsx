import axios from "axios";
import { useEffect, useState, useRef } from "react";
import checkIfInList from "../helper-functions/checkIfInList";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
const MovieModal = ({
	movieModalLoading,
	closeModal,
	movieModalData,
	MOVIE_DATA,
	watchProfile,
	movieListDispatch,
	movieList,
}) => {
	const [imageData, setImageData] = useState([]);
	const swiper = useRef();
	const [likedData, setLikedData] = useState(0);

	useEffect(() => {
		if (swiper.current !== undefined) {
			if (swiper.current.update) {
				swiper.current.swiper.update();
			}
		}
	}, [imageData]);
	// Data is brought in from movieModalData
	// movieModalData.video will contain an array of all the videos this media has.
	// movieModalData.movie will contain the data for the movie similar to what is in MOVIE_DATA
	const addToWatchList = async () => {
		try {
			let newData;
			const { data } = await axios.put(
				`/api/list/${movieModalData.movie.id}?profile=${watchProfile.id}&typeOf=${movieModalData.movie.media_type}&movieTitle=${movieModalData.movie.title}&moviePoster=${movieModalData.movie.poster_path}`
			);
			let oldData = data;
			if (oldData.typeOf === "movie") {
				const result = await axios.get(
					`/api/movies/info/movie/${oldData.TMDBMovieID}`
				);
				newData = result.data.data;
			} else {
				const result = await axios.get(
					`/api/movies/info/tv/${oldData.TMDBMovieID}`
				);
				newData = result.data.data;
			}
			movieListDispatch({ type: "update", payload: newData });
		} catch (e) {
			console.error(e);
		}
	};

	const removeFromWatchList = async () => {
		try {
			const { data } = await axios.delete(
				`/api/list/${movieModalData.movie.id}?profile=${watchProfile.id}`
			);
			let result = data;
			if (result.message === "Success") {
				movieListDispatch({ type: "delete", payload: result.id });
			}
			if (result.message === "Not Found") {
				console.error("Item was not found in list when attempting to delete");
			}
		} catch (e) {
			console.error(e);
		}
	};

	const likeMovie = async (rating) => {
		// Sends request to the api to add a user rating
		try {
			const { data } = await axios.put(
				`/api/likes/${movieModalData.movie.id}?profile=${watchProfile.id}&rating=${rating}`
			);
			if (data.success === true) {
				setLikedData(rating);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const grabMovieRating = async () => {
		try {
			const { data } = await axios.get(
				`/api/likes/${movieModalData.movie.id}`,
				{
					params: {
						profile: watchProfile.id,
					},
				}
			);
			if (data.success === true) {
				setLikedData(data.data);
			}
		} catch (e) {
			console.error(e, "Error grabbing like rating");
		}
	};

	// const [loading, setLoading] = useState(true);
	if (!movieModalData.movie.genre_ids && movieModalData.movie.genres) {
		// When grabbing data from watchlist data is jumbled slightly.
		// This should correct it before its rendered.
		movieModalData.movie.genre_ids = [];
		for (let i of movieModalData.movie.genres) {
			movieModalData.movie.genre_ids.push(i.id);
		}
	}

	const grabImages = async () => {
		try {
			if (!movieModalLoading) {
				if (movieModalData.movie.media_type === "movie") {
					const { data } = await axios.get(
						`/api/movies/image/movie/${movieModalData.movie.id}`
					);
					setImageData([...data.data.backdrops]);
				} else {
					const { data } = await axios.get(
						`/api/movies/image/tv/${movieModalData.movie.id}`
					);
					setImageData([...data.data.backdrops]);
				}
			}
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		grabImages();
		grabMovieRating();
	}, [movieModalLoading]);

	return (
		<div className="modal-dialog modal-fullscreen text-white">
			<div className="modal-content">
				<div className="modal-header bg-dark">
					<h5 className="modal-title" id="movie-title">
						{!movieModalLoading && movieModalData.movie.title}
					</h5>
					<button
						type="button"
						className="btn-close btn-close-white"
						onClick={closeModal}
					></button>
				</div>
				<div className="modal-body bg-dark bg-gradient-reverse">
					<div className="container-fill">
						{movieModalLoading && <div>Loading...</div>}
						{!movieModalLoading && movieModalData.video && (
							<div className="row">
								<div className="col-md">
									<h2 className="display-1 amatic-font">
										{movieModalData.movie.title}
									</h2>
									<span className="fst-italic">
										{movieModalData.movie.media_type === "tv"
											? "TV Series"
											: "Movie"}{" "}
										|
									</span>
									{movieModalData.movie.genre_ids.map((e) => {
										if (movieModalData.movie.media_type === "movie") {
											for (let i of MOVIE_DATA.movie.genres) {
												if (i.id === e) {
													return <span className="fst-italic"> {i.name} </span>;
												}
											}
										} else {
											for (let i of MOVIE_DATA.tv.genres) {
												if (i.id === e) {
													return <span className="fst-italic"> {i.name} </span>;
												}
											}
										}
									})}
									<span>
										| {movieModalData.movie.vote_average.toFixed(1)}/10 | {}
									</span>
									<span className="">
										{movieModalData.movie.first_air_date
											? movieModalData.movie.first_air_date
											: movieModalData.movie.release_date}
									</span>
									<p>{movieModalData.movie.overview}</p>
									{checkIfInList(movieList.results, movieModalData.movie) ? (
										<OverlayTrigger
											key={"remove"}
											placement={"top"}
											overlay={
												<Tooltip id={`tooltip-remove`}>
													Remove from my <strong>List</strong>.
												</Tooltip>
											}
										>
											<button
												className="mx-1 p-auto text-nowrap btn rounded btn-outline-primary"
												onClick={() => {
													removeFromWatchList();
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="25"
													height="25"
													fill="currentColor"
													class="bi bi-dash-circle"
													viewBox="0 0 16 16"
												>
													<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
													<path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
												</svg>
											</button>
										</OverlayTrigger>
									) : (
										<OverlayTrigger
											key={"add"}
											placement={"top"}
											overlay={
												<Tooltip id={`tooltip-add`}>
													Add to my <strong>List</strong>.
												</Tooltip>
											}
										>
											<button
												className="btn btn-outline-secondary rounded mx-1"
												onClick={() => {
													addToWatchList();
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="25"
													height="25"
													fill="currentColor"
													class="bi bi-plus-circle"
													viewBox="0 0 16 16"
												>
													<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
													<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
												</svg>
											</button>
										</OverlayTrigger>
									)}
									<button
										className={`btn ${
											likedData === 1 ? "btn-danger" : "btn-outline-secondary"
										} rounded ms-3 mx-1`}
										onClick={() => {
											likeMovie(1);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="25"
											height="25"
											fill="currentColor"
											class="bi bi-hand-thumbs-down"
											viewBox="0 0 16 16"
										>
											<path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" />
										</svg>{" "}
										<span hidden>dislike</span>
									</button>

									<button
										className={`btn ${
											likedData === 2 ? "btn-success" : "btn-outline-secondary"
										} rounded mx-1`}
										onClick={() => {
											likeMovie(2);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="25"
											height="25"
											fill="currentColor"
											class="bi bi-hand-thumbs-up"
											viewBox="0 0 16 16"
										>
											<path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
										</svg>
										<span hidden>liked</span>
									</button>
									<button
										className={`btn ${
											likedData === 3 ? "btn-success" : "btn-outline-secondary"
										} rounded mx-1`}
										onClick={() => {
											likeMovie(3);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="25"
											height="25"
											fill="currentColor"
											class="bi bi-hand-thumbs-up"
											viewBox="0 0 16 16"
										>
											<path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="25"
											height="25"
											fill="currentColor"
											class="bi bi-hand-thumbs-up"
											viewBox="0 0 16 16"
										>
											<path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
										</svg>
										<span hidden>really liked</span>
									</button>
								</div>
								<div className="col text-white my-3">
									<ul className="nav nav-tabs" id="myTab" role="tablist">
										{movieModalData.video.map((e) => {
											return (
												<li className={`nav-item `} role="presentation">
													<button
														class={`nav-link ${
															e.id === movieModalData.video[0].id
																? "active"
																: ""
														}`}
														key={e.id}
														id={`${e.id}-tab`}
														data-bs-toggle="tab"
														data-bs-target={`#nav-${e.id}`}
														type="button"
														role="tab"
														aria-controls={`nav-${e.id}`}
														aria-selected={
															e.id === movieModalData.video[0].id
																? "true"
																: "false"
														}
													>
														{e.name}
													</button>
												</li>
											);
										})}
									</ul>
									<div className="tab-content" id="myTabContent">
										{movieModalData.video.map((e) => {
											return (
												<div
													className={`tab-pane fade ${
														e.id === movieModalData.video[0].id
															? "show active"
															: ""
													}`}
													id={`nav-${e.id}`}
													role="tabpanel"
													aria-labelledby={`${e.id}-tab`}
												>
													{movieModalData.video[0].key && (
														<div className="ratio ratio-16x9">
															<iframe
																src={`https://www.youtube.com/embed/${e.key}`}
																title={movieModalData.movie.title}
																allowFullScreen={true}
															></iframe>
														</div>
													)}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						)}
						<div className="row">
							<div className="col">
								<h3 className="text-center amatic-font fs-1">Images</h3>
								<div className="border-top">
									<Swiper
										key={"Images Banner"}
										slidesPerView={1}
										navigation={imageData.length < 3 ? false : true}
										modules={[Navigation]}
										ref={swiper}
										// loop={movieData.length < 7 ? false : true}
										breakpoints={{
											"@0.00": {
												slidesPerView: 1,
												spaceBetween: 10,
												slidesPerGroup: 1,
											},
											"@0.75": {
												slidesPerView: 1,
												spaceBetween: 20,
												slidesPerGroup: 1,
											},
											"@1.00": {
												slidesPerView: 3,
												spaceBetween: 40,
												slidesPerGroup: 3,
											},
											"@1.50": {
												slidesPerView: 3,
												spaceBetween: 50,
												slidesPerGroup: 3,
											},
										}}
									>
										{imageData.map((e, i) => {
											return (
												<SwiperSlide key={`slide_${i}`}>
													<img
														src={`https://image.tmdb.org/t/p/original/${e.file_path}`}
														alt=""
														className="img-fluid border-top-0 shadow"
													/>
												</SwiperSlide>
											);
										})}
									</Swiper>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieModal;
