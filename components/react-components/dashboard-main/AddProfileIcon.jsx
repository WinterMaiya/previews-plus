import Image from "next/image";

const AddProfileIcon = ({ openModal }) => {
	return (
		<div className="m-auto">
			<div className="my-4 watch-profile">
				<Image
					src="/images/plusicon.png"
					alt="Watch Profile Image"
					data-testid="add-profile-con"
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
