import Image from "next/image";
import { useState, useEffect } from "react";

const ProfileImages = ({ imageInfo, profileIcon, setProfileIcon }) => {
	// Creates the profile icons a user can select which will act like a radio button
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		// Reloads the module if it has detected a change to the parent state
		imageInfo === profileIcon ? setIsSelected(true) : setIsSelected(false);
	}, [profileIcon, imageInfo]);

	const selectImage = () => {
		// Sets the profile icon hook of the parent
		setProfileIcon(imageInfo);
	};
	return (
		<div>
			<Image
				src={imageInfo}
				alt="Profile Icon Image"
				width={500}
				height={500}
				className={`form-check ${
					isSelected ? "border border-primary border-3" : ""
				}`}
				onClick={selectImage}
			></Image>
		</div>
	);
};

export default ProfileImages;
