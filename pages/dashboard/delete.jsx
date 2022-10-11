import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { prisma } from "../../components/helper-functions/prisma";
import ProfileIconDelete from "../../components/react-components/dashboard-main/ProfileIconDelete";
import Router from "next/router";

const DeleteWatchProfile = ({ watchProfiles }) => {
	// This lets the user delete a watch profile
	const [loading, setLoading] = useState(false);

	return (
		<div>
			<Head>
				<title>Dashboard</title>
			</Head>
			<section className="container my-2 center-screen text-white">
				{loading && (
					<div className="text-center ">
						<div
							className="spinner-border text-primary watch-profile-loading"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				)}
				{!loading && (
					<div className="container">
						<div className="row">
							<div className="col text-center">
								<h1 className="display-2" data-testid="header">
									Delete a Profile
								</h1>
							</div>
						</div>

						<div className={`row row-cols-2 row-cols-md-6`}>
							{watchProfiles.map((e) => {
								return (
									<div className="col" key={e.id}>
										<ProfileIconDelete
											profileData={e}
											setLoading={setLoading}
										/>
									</div>
								);
							})}
						</div>
						<div className="row text-center justify-content-center">
							<div className="col-auto">
								<button
									className="btn btn-outline-secondary rounded"
									onClick={() => {
										Router.push("/dashboard/");
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										fill="currentColor"
										class="bi bi-arrow-90deg-left"
										viewBox="0 0 16 16"
									>
										<path
											fill-rule="evenodd"
											d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z"
										/>
									</svg>
								</button>
								<span hidden>Go Back</span>
							</div>
						</div>
					</div>
				)}
			</section>
		</div>
	);
};

export async function getServerSideProps({ req }) {
	const session = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	const watchProfiles = await prisma.WatchProfile.findMany({
		where: {
			User: {
				email: session.user.email,
			},
		},
	});

	if (watchProfiles.length === 0) {
		return {
			redirect: {
				destination: "/dashboard/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
			watchProfiles,
		},
	};
}

export default DeleteWatchProfile;
