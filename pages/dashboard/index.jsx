import { getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import callBack from "../../components/helper-functions/callBack";
import { prisma } from "../../components/helper-functions/prisma";
import AddProfileIcon from "../../components/react-components/dashboard-main/AddProfileIcon";
import CreateWatchProfile from "../../components/react-components/dashboard-main/CreateWatchProfile";
import ProfileIcon from "../../components/react-components/dashboard-main/ProfileIcon";

const dashboard = ({ session, watchProfiles }) => {
	// This is the main dashboard that lets a user choose their watchprofile
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

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
								<h1 className="display-1">Who's Watching?</h1>
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

export default dashboard;
