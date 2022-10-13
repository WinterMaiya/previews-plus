import axios from "axios";
import Router from "next/router";
import { useState } from "react";
import globalProfileImage from "../../helper-functions/GlobalProfileImage";
import ProfileImages from "./ProfileImages";

const CreateWatchProfile = ({ closeModal, setLoading }) => {
	// You only need to inputs to create a WatchProfile
	const [name, setName] = useState("");
	const [profileIcon, setProfileIcon] = useState();

	const submitData = async () => {
		if (!name || !profileIcon) {
			console.error("Please provide a name or select a profile icon");
			return "error";
		}
		if (!globalProfileImage.includes(profileIcon)) {
			console.error("Not a valid profile icon");
			return "error";
		}
		setLoading(true);
		closeModal();
		try {
			const create = await axios.post("/api/watchprofile/", {
				name,
				profile_pic: profileIcon,
			});
			Router.push(`/dashboard/${create.data.data.id}`);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="modal-dialog modal-fullscreen text-white">
			<div className="modal-content">
				<div className="modal-header bg-dark">
					<button
						type="button"
						className="btn-close btn-close-white"
						onClick={closeModal}
					></button>
				</div>
				<div className="modal-body bg-dark bg-gradient-reverse">
					<div className="container">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								submitData();
							}}
						>
							<div className="mb-3 text-center" data-testid="modal-header">
								<h2>Create New Watch Profile</h2>
							</div>
							<div className="mb-3">
								<label htmlFor="name" className="form-label" data-testid="name">
									{name ? `Hello ${name}!` : "Display Name"}
								</label>
								<input
									data-testid="input"
									type="text"
									value={name}
									className="form-control"
									id="name"
									placeholder="Display Name"
									onChange={(e) => {
										setName(e.target.value);
									}}
									required
								/>
							</div>
							<div className="mb-3 text-center">
								<button
									className="btn text-white btn-outline-primary"
									data-testid="button"
								>
									Start Watching
								</button>
							</div>
							<div className="mb-3 text-center">
								<h3 data-testid="profile-icon-header">Select A Profile Icon</h3>
								<div className="row">
									{globalProfileImage.map((e) => {
										return (
											<div className="col-md-2 col-4">
												<ProfileImages
													imageInfo={e}
													profileIcon={profileIcon}
													setProfileIcon={setProfileIcon}
												/>
											</div>
										);
									})}
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateWatchProfile;
