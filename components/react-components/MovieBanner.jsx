import checkIfInList from "../helper-functions/checkIfInList";
import axios from "axios";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const MovieBanner = ({
	movie,
	MOVIE_DATA,
	grabMovieData,
	openModal,
	movieList,
	movieListDispatch,
	watchProfile,
}) => {
	const [videoData, setVideoData] = useState();
	const grabVideoData = async (movie) => {
		// Grabs the data for the movie video from the api.
		// Return videos which have a trailer and sets the MovieModal hooks
		try {
			let data;

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
			setVideoData(res);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		grabVideoData(movie);
	}, []);

	const removeFromWatchList = async () => {
		try {
			const { data } = await axios.delete(
				`/api/list/${movie.id}?profile=${watchProfile.id}`
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

	const addToWatchList = async () => {
		try {
			let newData;
			const { data } = await axios.put(
				`/api/list/${movie.id}?profile=${watchProfile.id}&typeOf=${movie.media_type}&movieTitle=${movie.title}&moviePoster=${movie.poster_path}`
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

	return (
		<div className="card bg-dark text-white my-5">
			<img
				className="rounded card-img"
				src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
				alt={"Movie Backdrop image"}
			></img>
			<div className="card-img-overlay bg-dark bg-opacity-50">
				<div className="container">
					<div className="row">
						<div className="col">
							<h2 className="display-6 fst-italic d-none d-sm-block">
								Trending Today:
							</h2>
							<h1 className="display-1 amatic-font">
								{movie.title ? movie.title : movie.name}
							</h1>
						</div>
					</div>

					<div className="row">
						<div className="my-1 col-md-9">
							<div>
								{movie.genre_ids.map((e) => {
									if (movie.media_type === "movie") {
										for (let i of MOVIE_DATA.movie.genres) {
											if (i.id === e) {
												return <span className="fst-italic"> {i.name} </span>;
											}
										}
									} else {
										for (let i of MOVIE_DATA.tv.genres) {
											if (i.id === e) {
												return <span>{i.name} </span>;
											}
										}
									}
								})}
								<span>| {movie.vote_average.toFixed(1)}/10 |</span>
								<span> {movie.release_date}</span>
								<OverlayTrigger
									key={"info"}
									placement={"top"}
									overlay={
										<Tooltip id={`tooltip-info`}>
											More <strong>Info</strong>.
										</Tooltip>
									}
								>
									<button
										className="btn btn-sm btn-secondary rounded mx-1 ms-2"
										onClick={() => {
											grabMovieData(movie);
											openModal();
										}}
									>
										<svg
											data-bs-toggle="tooltip"
											data-bs-placement="top"
											title="Tooltip on top"
											xmlns="http://www.w3.org/2000/svg"
											width="25"
											height="25"
											fill="currentColor"
											className="bi bi-info-circle-fill"
											viewBox="0 0 16 16"
										>
											<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
										</svg>
									</button>
								</OverlayTrigger>

								{checkIfInList(movieList.results, movie) ? (
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
											className="p-auto text-nowrap btn btn-sm btn-danger"
											onClick={() => {
												removeFromWatchList();
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="25"
												height="25"
												fill="currentColor"
												className="bi bi-dash-circle"
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
												className="bi bi-plus-circle"
												viewBox="0 0 16 16"
											>
												<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
												<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
											</svg>
										</button>
									</OverlayTrigger>
								)}
							</div>
							<p className="lead w-100 text-break d-none d-sm-block">
								{movie.overview}
							</p>
						</div>
						<div className="row">
							<div className="col-3 col-md-3 col-xl-4 col-xxl-5">
								<div className="d-none d-lg-block mt-3">
									<ul className="nav nav-tabs" id="myTab" role="tablist">
										{videoData ? (
											<div>
												{videoData.map((e) => {
													return (
														<li
															className={`nav-item `}
															key={e.id}
															role="presentation"
														>
															<button
																className={`nav-link ${
																	e.id === videoData[0].id ? "active" : ""
																}`}
																id={`${e.id}-tab`}
																data-bs-toggle="tab"
																data-bs-target={`#nav-${e.id}`}
																type="button"
																role="tab"
																aria-controls={`nav-${e.id}`}
																aria-selected={
																	e.id === videoData[0].id ? "true" : "false"
																}
															>
																{e.name}
															</button>
														</li>
													);
												})}
											</div>
										) : (
											<div></div>
										)}
									</ul>
									<div className="tab-content" id="myTabContent">
										{videoData ? (
											<div>
												{videoData.map((e) => {
													return (
														<div
															className={`tab-pane fade ${
																e.id === videoData[0].id ? "show active" : ""
															}`}
															key={e.id}
															id={`nav-${e.id}`}
															role="tabpanel"
															aria-labelledby={`${e.id}-tab`}
														>
															{videoData[0].key && (
																<div className="ratio ratio-16x9">
																	<iframe
																		src={`https://www.youtube.com/embed/${e.key}`}
																		title={""}
																		allowFullScreen={true}
																	></iframe>
																</div>
															)}
														</div>
													);
												})}
											</div>
										) : (
											<div></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="100"
							height="100"
							fill="currentColor"
							className="up-and-down d-none d-xxl-block bi bi-chevron-double-down mb-5"
							viewBox="0 0 16 16"
						>
							<path
								fillRule="evenodd"
								d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
							/>
							<path
								fillRule="evenodd"
								d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieBanner;
