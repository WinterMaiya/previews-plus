import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { prisma } from "../../components/helper-functions/prisma";
import Router from "next/router";
import ProfileIconEdit from "../../components/react-components/dashboard-main/ProfileIconEdit";
import EditWatchProfile from "../../components/react-components/dashboard-main/EditWatchProfile";

const EditWatchProfilePage = ({ watchProfiles }) => {
	// This page lets you edit profiles
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [name, setName] = useState("");
	const [profileIcon, setProfileIcon] = useState("");
	const [id, setId] = useState(0);
	const openModal = (data) => {
		setShowModal(true);
		setName(data.name);
		setProfileIcon(data.profile_pic);
		setId(data.id);
	};
	const closeModal = () => setShowModal(false);

	return (
		<div>
			<Head>
				<title>Edit Dashboard</title>
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
									Edit Profile
								</h1>
							</div>
						</div>

						<div className={`row row-cols-2 row-cols-md-6`}>
							{watchProfiles.map((e) => {
								return (
									<div className="col" key={e.id}>
										<ProfileIconEdit
											profileData={e}
											setLoading={setLoading}
											openModal={openModal}
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
										className="bi bi-arrow-90deg-left"
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
			<Modal show={showModal} onHide={closeModal} fullscreen={true}>
				<EditWatchProfile
					closeModal={closeModal}
					setLoading={setLoading}
					name={name}
					setName={setName}
					profileIcon={profileIcon}
					setProfileIcon={setProfileIcon}
					id={id}
				/>
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

	if (watchProfiles.length === 0 || !watchProfiles) {
		return {
			redirect: {
				destination: "/",
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

export default EditWatchProfilePage;
