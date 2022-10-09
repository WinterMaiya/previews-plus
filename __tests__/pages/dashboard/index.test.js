import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../../../pages/dashboard/index";
import CreateWatchProfile from "../../../components/react-components/dashboard-main/CreateWatchProfile";

const watchProfilesBlank = [];
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

describe("Dashboard Watch Profile", () => {
	it("Check Snapshot", async () => {
		const { container } = render(
			<Dashboard watchProfiles={watchProfilesContent} />
		);

		expect(container).toMatchSnapshot();
		// expect(screen.getByText("LOG OUT")).toBeInTheDocument();
	});
	it("Renders Dashboard with no watchProfiles", async () => {
		render(<Dashboard watchProfiles={watchProfilesBlank} />);

		expect(screen.getByTestId("header")).toBeInTheDocument();
	});
	it("Renders Dashboard with a watchProfile", async () => {
		render(<Dashboard watchProfiles={watchProfilesContent} />);

		expect(screen.getByTestId("header")).toBeInTheDocument();
		expect(screen.getByText("Test Account")).toBeInTheDocument();
		expect(screen.getByText("Super Test Account")).toBeInTheDocument();
	});
	it("Renders the Create Profile Modal Correctly", async () => {
		render(<CreateWatchProfile />);

		expect(screen.getByTestId("modal-header")).toBeInTheDocument();
		expect(screen.getByTestId("button")).toBeInTheDocument();
		expect(screen.getByTestId("profile-icon-header")).toBeInTheDocument();
		expect(screen.getByTestId("name")).toBeInTheDocument();
		expect(screen.getByTestId("input")).toBeInTheDocument();
	});
});
