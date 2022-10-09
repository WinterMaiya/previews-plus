import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Router from "next/router";

const AddProfileIcon = ({ openModal }) => {
	const [profileHover, setProfileHover] = useState(false);

	return (
		<div
			className="m-auto"
			onMouseEnter={() => {
				setProfileHover(true);
			}}
			onMouseLeave={() => {
				setProfileHover(false);
			}}
		>
			<div className="my-4 watch-profile">
				<Image
					src="/images/plusicon.png"
					alt="Watch Profile Image"
					className="rounded-circle card-img-top watch-profile-image"
					width={500}
					height={500}
					onClick={openModal}
				/>
			</div>
		</div>
	);
};

export default AddProfileIcon;
