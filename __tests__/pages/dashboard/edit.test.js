import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../../../pages/dashboard/index";
import CreateWatchProfile from "../../../components/react-components/dashboard-main/CreateWatchProfile";
import EditWatchProfilePage from "../../../pages/dashboard/edit";
import EditWatchProfile from "../../../components/react-components/dashboard-main/EditWatchProfile";

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

describe("Dashboard Edit Profile", () => {
	it("Check Snapshot", async () => {
		const { container } = render(
			<EditWatchProfilePage watchProfiles={watchProfilesContent} />
		);

		expect(container).toMatchSnapshot();
		// expect(screen.getByText("LOG OUT")).toBeInTheDocument();
	});
	it("Renders Edit Profile", async () => {
		render(<EditWatchProfilePage watchProfiles={watchProfilesContent} />);

		expect(screen.getByTestId("header")).toBeInTheDocument();
		expect(screen.getByText("Test Account")).toBeInTheDocument();
		expect(screen.getByText("Super Test Account")).toBeInTheDocument();
		expect(screen.getByText("Edit Profile")).toBeInTheDocument();
	});
	it("Renders the Edit Profile Modal Correctly", async () => {
		render(<EditWatchProfile />);

		expect(screen.getByTestId("modal-header")).toBeInTheDocument();
		expect(screen.getByTestId("button")).toBeInTheDocument();
		expect(screen.getByTestId("profile-icon-header")).toBeInTheDocument();
		expect(screen.getByTestId("name")).toBeInTheDocument();
		expect(screen.getByTestId("input")).toBeInTheDocument();
	});
});
