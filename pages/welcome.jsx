import { getSession, signIn } from "next-auth/react";

const WelcomePage = () => {
	/* TODO: Create this page*/
	return (
		<section className="text-white">
			<div className="container my-5">
				<h1 className="text-center satisfy-font">Previews+</h1>
				<div className="row text-center">
					<div className="col">
						<button className="text-white btn btn-primary" onClick={signIn}>
							Sign in
						</button>
					</div>
					<div className="col">
						View this project on{" "}
						<a href="https://github.com/WinterMaiya/previewsPlus">Github</a>
					</div>
				</div>
				<div className="row text-center">
					<p>
						{/* TODO: Add welcome page detail */}
						TODO: Data being added...
					</p>
				</div>
			</div>
		</section>
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
