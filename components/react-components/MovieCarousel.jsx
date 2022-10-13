import { useEffect, useRef } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "./MovieCard";
import { useState } from "react";

const MovieCarousel = ({
	movies,
	title,
	grabMovieData,
	openModal,
	watchProfile,
}) => {
	const [movieData, setMovieData] = useState([...movies.results]);
	const swiper = useRef();

	useEffect(() => {
		if (swiper.current !== undefined) {
			try {
				swiper.current.swiper.update();
			} catch (e) {
				// Don't update swiper
			}
		}
	}, [movieData]);

	useEffect(() => {
		setMovieData([...movies.results]);
	}, [movies]);

	return (
		<div>
			{movies.results.length ? (
				<div>
					<div className="">
						<h2 className="amatic-font text-start display-6 m-0">{title}</h2>
						{movieData && (
							<div className="border-top">
								<Swiper
									key={movieData}
									slidesPerView={2}
									navigation={movieData.length < 7 ? false : true}
									modules={[Navigation]}
									ref={swiper}
									// loop={movieData.length < 7 ? false : true}
									breakpoints={{
										"@0.00": {
											slidesPerView: 2,
											spaceBetween: 10,
											slidesPerGroup: 2,
										},
										"@0.75": {
											slidesPerView: 4,
											spaceBetween: 20,
											slidesPerGroup: 3,
										},
										"@1.00": {
											slidesPerView: 6,
											spaceBetween: 40,
											slidesPerGroup: 3,
										},
										"@1.50": {
											slidesPerView: 6,
											spaceBetween: 50,
											slidesPerGroup: 3,
										},
									}}
								>
									{movieData.map((e, i) => {
										if (e.media_type !== "person") {
											if (e.media_type == undefined) {
												e.media_type = movies.media_type;
											}
											if (e.poster_path) {
												return (
													<SwiperSlide key={`slide_${i}`}>
														<MovieCard
															grabMovieData={grabMovieData}
															movie={e}
															openModal={openModal}
															watchProfile={watchProfile}
														/>
													</SwiperSlide>
												);
											}
										}
									})}
								</Swiper>
							</div>
						)}
					</div>
				</div>
			) : (
				<div>
					<h5>No results for {title}...</h5>
				</div>
			)}
		</div>
	);
};
export default MovieCarousel;
