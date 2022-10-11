import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import axios from "axios";

const WelcomePage = () => {
	/* TODO: Create this page*/
	return (
		<div>
			<Head>
				<title>Previews+</title>
			</Head>
			<section className="text-white">
				<div className="container">
					<h1 className="text-center text-primary satisfy-font bg-dark mt-4 make-logo-bigger">
						Previews+
					</h1>
					<p className="text-center fst-italic fw-light">
						Watch <strong>unlimited</strong> previews
					</p>
				</div>
				<div className="parallax bg-1"></div>
				<div className="container my-3">
					<div className="row text-center"></div>
					<div className="row text-center ">
						<p className="fs-5">
							<strong className="fst-italic">Previews+</strong> lets you stream
							your favorite movies and tv shows'{" "}
							<strong className="text-primary">trailers!</strong>
						</p>
						<p className="fs-6">
							Create an account through{" "}
							<strong className="text-primary">Github</strong> or{" "}
							<strong className="text-primary">Google</strong>, make your own
							watch profile, and start browsing our list of the most popular (or
							obscure) trailers on the web:
						</p>
						<div className="col">
							<button
								className="text-white btn btn-outline-primary"
								onClick={signIn}
							>
								Start Here
							</button>
						</div>
					</div>
				</div>
				<div className="parallax bg-2"></div>
				<div className="container my-5">
					<div className="row text-center">
						<div className="col">
							<p className="fs-5">
								Add videos you want to see to your{" "}
								<strong className="text-primary">Watchlist </strong>
								or rate videos you've seen before. Our algorithm learns your
								preferences in order to show you
								<strong className="text-primary"> new </strong>shows and movies
								you will enjoy!
							</p>
						</div>
					</div>
				</div>
				<div className="parallax bg-3"></div>
				<div className="container my-5">
					<div className="row text-center">
						<div className="col">
							<h3 className="fs-4">
								About the <strong className="text-primary">Project</strong>
							</h3>
							<p>
								This project was created by{" "}
								<a
									href="https://www.linkedin.com/in/maiya-winter/"
									className="fst-italic text-white"
								>
									Maiya Winter
									{/*  */}
								</a>
								{/*  */} using{" "}
								<strong>Next.js, Prisma, PostgreSQL, and Next-Auth</strong>. You
								can view this project on{" "}
								<a
									href="https://github.com/WinterMaiya/previews-plus"
									className="fst-italic text-white"
								>
									Github
								</a>
								. I created this project as an attempt to replicate popular
								streaming services. This was my first project with Next.js so it
								was an excellent adn exciting learning experience for me to
								learn and improve. Any advice or questions are more then
								welcome. You can contact me through my <strong>Github </strong>
								page.
							</p>
						</div>
					</div>
				</div>

				<div className="parallax bg-4"></div>
				<div className="container my-3">
					<div className="row text-center">
						<div className="col">
							<h3 className="display-6 my-2">Ready to get started?</h3>
							<button
								className="text-white btn btn-outline-primary my-3"
								onClick={signIn}
							>
								Start Here
							</button>
						</div>
					</div>
				</div>
				<div className="parallax bg-5"></div>
				<div className="container my-3">
					<div className="row text-center">
						<div className="col">
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
			</section>
		</div>
	);
};
export async function getServerSideProps({ req }) {
	const session = await getSession({ req });

	if (session) {
		// If someone is logged in send them to the dashboard.
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
}

export default WelcomePage;
