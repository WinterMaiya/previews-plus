import { getSession } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import callBack from "../../components/helper-functions/callBack";
import { prisma } from "../../components/helper-functions/prisma";
import AddProfileIcon from "../../components/react-components/dashboard-main/AddProfileIcon";
import CreateWatchProfile from "../../components/react-components/dashboard-main/CreateWatchProfile";
import ProfileIcon from "../../components/react-components/dashboard-main/ProfileIcon";

const Dashboard = ({ watchProfiles }) => {
	// TODO: create a edit page and delete page for the user to change and delete watchProfiles
	// This is the main dashboard that lets a user choose their watchprofile
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	console.log(watchProfiles);

	const len = 6 - watchProfiles.length;
	useEffect(() => {
		if (len === 6) {
			// If the account has no watch profiles,
			// then automatically let them create a new watch profile
			openModal();
		}
	}, []);

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
								<h1 className="display-1" data-testid="header">
									Who's Watching?
								</h1>
							</div>
						</div>

						<div className={`row row-cols-2 row-cols-md-6`}>
							{watchProfiles.map((e) => {
								return (
									<div className="col" key={e.id}>
										<ProfileIcon profileData={e} setLoading={setLoading} />
									</div>
								);
							})}
							{callBack(() => {
								// Creates extra plus signs to make the display feel organic.
								// Only shows one AddProfileIcon on mobile devices
								const row = [];
								if (len !== 0) {
									for (let i = 0; i < len; i++) {
										if (i === 0) {
											row.push(
												<div className="col" key={i}>
													<AddProfileIcon openModal={openModal} />
												</div>
											);
										} else {
											row.push(
												<div className="col d-none d-md-block" key={i}>
													<AddProfileIcon openModal={openModal} />
												</div>
											);
										}
									}
								}

								return row;
							})}
						</div>
						<div className="row text-center justify-content-center">
							<div className="col-auto">
								<button className="btn btn-outline-secondary rounded">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										fill="currentColor"
										class="bi bi-pencil-square"
										viewBox="0 0 16 16"
									>
										<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
										<path
											fill-rule="evenodd"
											d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
										/>
									</svg>
								</button>
								<span hidden>Edit</span>
							</div>
							<div className="col-auto">
								<button
									className="btn btn-outline-danger rounded"
									onClick={() => {
										Router.push("/dashboard/delete");
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										fill="currentColor"
										class="bi bi-trash3"
										viewBox="0 0 16 16"
									>
										<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
									</svg>
								</button>
								<span hidden>Delete</span>
							</div>
						</div>
					</div>
				)}
			</section>
			<Modal show={showModal} onHide={closeModal} fullscreen={true}>
				<CreateWatchProfile closeModal={closeModal} setLoading={setLoading} />
			</Modal>
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

	return {
		props: {
			session,
			watchProfiles,
		},
	};
}

export default Dashboard;
