import axios from "axios";
import { useEffect, useState, useRef } from "react";
import checkIfInList from "../helper-functions/checkIfInList";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Virtual } from "swiper";
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
	};

	const removeFromWatchList = async () => {
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
	};

	useEffect(() => {
		grabImages();
	}, [movieModalLoading]);

	console.log(movieModalData);

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
												className="p-auto text-nowrap btn btn-sm rounded btn-secondary"
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
												className="btn btn-sm btn-secondary rounded"
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

									<button className="btn btn-primary" disabled>
										Dislike
									</button>
									<button className="btn btn-primary" disabled>
										Like
									</button>
									<button className="btn btn-primary" disabled>
										Really Liked
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
								{/* TODO: Add more images*/}
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
