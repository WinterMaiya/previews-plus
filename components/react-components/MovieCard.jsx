// Creates the movie card object which will be used with the carosel. A user will be able to click on

import axios from "axios";

// the poster to pull up the movie modal with more information and a trailer.
const MovieCard = ({ movie, openModal, grabMovieData, watchProfile }) => {
	const movieRatingColor = (rating) => {
		// Takes the rating and changes the color of the background.
		// ratings of 7 or greater is Green, ratings of 4-7 are yellow, everything else red
		if (!rating) {
			return "info";
		}
		if (rating == 0.0) {
			return "info";
		}
		if (rating >= 7) {
			return "success";
		}
		if (rating >= 4) {
			return "warning";
		}
		return "danger";
	};
	const rating = movie.vote_average.toFixed(1);
	const clickedVideo = async () => {
		console.log(movie, "Movie clicked");
		if (movie.media_type !== undefined) {
			const { data } = await axios.put(`/api/movies/watched/${movie.id}?`, {
				params: {
					profile: watchProfile.id,
					movieTitle: movie.title ? movie.title : movie.name,
					moviePoster: movie.poster_path,
					typeOf: movie.media_type,
					genre: movie.genre_ids,
				},
			});
			if (!data.success) {
				console.error(data);
			}
		} else {
			console.error("The movie data does not exist");
		}
	};
	return (
		<div>
			<div className="card w-100 m-5 mx-2 movie-card shadow-lg position-relative">
				<span
					class={`text-dark position-absolute top-100 start-50 translate-middle badge rounded-circle bg-${movieRatingColor(
						rating
					)}`}
				>
					{" "}
					{rating == 0.0 ? "Soon" : <span>{rating}/10</span>}
					<span class="visually-hidden">Rating: {rating}/10</span>
				</span>
				{movie.poster_path ? (
					<img
						src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
						// data-bs-toggle="modal"
						// data-bs-target="#MovieModal"
						onClick={() => {
							openModal();
							grabMovieData(movie);
							clickedVideo();
						}}
					></img>
				) : (
					<div className="w-100 h-100"></div>
				)}
			</div>
		</div>
	);
};

export default MovieCard;
