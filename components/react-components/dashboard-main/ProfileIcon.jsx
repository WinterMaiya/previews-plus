import Image from "next/image";
import Router from "next/router";

const ProfileIcon = ({ profileData, setLoading }) => {
	const onClick = () => {
		setLoading(true);
		Router.push(`/dashboard/${profileData.id}`);
	};
	return (
		<div className="m-auto text-white">
			<div className="my-4 watch-profile">
				<Image
					src={profileData.profile_pic}
					alt="Watch Profile Image"
					className="rounded-circle card-img-top watch-profile-image"
					width={200}
					height={200}
					onClick={() => {
						onClick();
					}}
				/>
			</div>
			<div className="text-center">
				<h2>{profileData.name}</h2>
			</div>
		</div>
	);
};

export default ProfileIcon;
