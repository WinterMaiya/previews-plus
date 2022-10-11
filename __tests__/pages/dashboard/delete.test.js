import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteWatchProfile from "../../../pages/dashboard/delete";

const watchProfilesContent = [
	{
		id: "cl8y15biy000192a7s9qxgdms",
		name: "Test Account",
		profile_pic: "/stockphotos/racoon1.jpg",
		userId: "cl8vyy7dv000092vf9n6rwj7i",
	},
	{
		id: "cl8y15biy000192a7s9qxgdss",
		name: "Super Test Account",
		profile_pic: "/stockphotos/jellyfish1.jpg",
		userId: "cl8vyy7dv000092vf9n6rwj7i",
	},
];

describe("Dashboard Delete Profile", () => {
	it("Check Snapshot", async () => {
		const { container } = render(
			<DeleteWatchProfile watchProfiles={watchProfilesContent} />
		);

		expect(container).toMatchSnapshot();
		// expect(screen.getByText("LOG OUT")).toBeInTheDocument();
	});
	it("Renders Delete Profile", async () => {
		render(<DeleteWatchProfile watchProfiles={watchProfilesContent} />);

		expect(screen.getByTestId("header")).toBeInTheDocument();
		expect(screen.getByText("Test Account")).toBeInTheDocument();
		expect(screen.getByText("Super Test Account")).toBeInTheDocument();
		expect(screen.getByText("Delete a Profile")).toBeInTheDocument();
	});
});
