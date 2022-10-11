const infoComponent = () => {
	return (
		<section id="Info">
			<div className="my-5">
				<div className="container my-5">
					<div className="row">
						<div className="col text-center">
							<h2 className="display-5">
								Previews+ is a project created by Maiya Winter
							</h2>
						</div>
					</div>
					<div className="row">
						<div className="col text-center">
							<p>
								This project was created using Next.js, Prisma, PostgreSQL,
								Next-Auth, Swiper, and more... You can view this project on{" "}
								<a
									href="https://github.com/WinterMaiya/previews-plus"
									className="text-white"
								>
									Github
								</a>
								. I created this project as an attempt to replicate popular
								streaming services. This was my first project with Next.js so it
								was an excellent learning experience for me to learn and
								improve. Any advice or questions are more then welcome, you can
								contact me through my Github page.
							</p>
							<p>
								External API data thanks to <strong>TMDB:</strong>
								{/*  */}
								<div>
									<a href="https://www.themoviedb.org">
										<img
											src="/images/tmdb_logo.svg"
											width="100"
											height="100"
										></img>
									</a>
								</div>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default infoComponent;
