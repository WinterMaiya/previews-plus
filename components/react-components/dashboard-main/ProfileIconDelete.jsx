import axios from "axios";
import Image from "next/image";
import Router from "next/router";

const ProfileIconDelete = ({ profileData }) => {
	const deleteProfile = async () => {
		try {
			const { data } = await axios.delete(
				`/api/watchprofile/${profileData.id}`
			);
			if (data.success) {
				Router.push("/dashboard/");
			}
		} catch (e) {
			console.error(e);
		}
	};
	return (
		<div className="m-auto text-white">
			<div className="my-4 watch-profile">
				<Image
					src={profileData.profile_pic}
					alt="Watch Profile Image"
					className="rounded-circle card-img-top border border-2 border-danger watch-profile-image"
					width={200}
					height={200}
					onClick={deleteProfile}
				/>
			</div>
			<div className="text-center">
				<h2>{profileData.name}</h2>
			</div>
		</div>
	);
};

export default ProfileIconDelete;
