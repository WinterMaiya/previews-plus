import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileDashboard from "../../../pages/dashboard/[profile]";
import movieDataMock from "../../../__mocks__/movieDataMock";
import userEvent from "@testing-library/user-event";

let movieData;
let session;
let watchList;
let checkUser;
let watchProfile;

// Testing help provided from https://github.com/nextauthjs/next-auth/discussions/4185
jest.mock("next-auth/react", async () => {
	const originalModule = jest.requireActual("next-auth/react");
	const mockSession = {
		expires: new Date(Date.now() + 2 * 86400).toISOString(),
		user: { name: "Test", email: "test@test.com" },
	};
	return {
		__esModule: true,
		...originalModule,
		useSession: jest.fn(() => {
			return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
		}),
	};
});

describe("Test Profile Dashboard", () => {
	beforeAll(async () => {
		// Create the data needed for the render functions in the test
		movieData = movieDataMock;
		movieData.watchList = {
			results: [
				{
					id: 2,
					name: "Watchlist",
					can_delete: false,
					watchProfileId: "cl8y15biy000192a7s9qxgdms",
				},
			],
		};
		session = {};
		watchList = [
			{
				id: 2,
				name: "Watchlist",
				can_delete: false,
				watchProfileId: "cl8y15biy000192a7s9qxgdms",
			},
		];
		checkUser = {};
		watchProfile = {
			id: "cl8y15biy000192a7s9qxgdms",
			name: "Test Account",
			profile_pic: "/stockphotos/racoon1.jpg",
			userId: "cl8vyy7dv000092vf9n6rwj7i",
			list: [
				{
					id: 2,
					name: "Watchlist",
					can_delete: false,
					watchProfileId: "cl8y15biy000192a7s9qxgdms",
				},
			],
			watched: [
				{
					id: 24,
					TMDBMovieID: "94997",
					rating: 0,
					title: "House of the Dragon",
					picture_ref: "/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
					typeOf: "tv",
					genre: "10765,18,10759",
					watchProfileId: "cl8y15biy000192a7s9qxgdms",
					listId: null,
				},
				{
					id: 25,
					TMDBMovieID: "579974",
					rating: 0,
					title: "RRR",
					picture_ref: "/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg",
					typeOf: "movie",
					genre: "28,18",
					watchProfileId: "cl8y15biy000192a7s9qxgdms",
					listId: null,
				},
			],
			preference: {
				movie: {
					14: 2,
				},
				tv: {
					18: 4,
				},
			},
		};
	});
	it("Matches Snapshot", async () => {
		const { container } = render(
			<ProfileDashboard
				movieData={movieData}
				session={session}
				watchList={watchList}
				checkUser={checkUser}
				watchProfile={watchProfile}
			/>
		);

		expect(container).toMatchSnapshot();
	});
	it("Check Initial Components to Exist", async () => {
		render(
			<ProfileDashboard
				movieData={movieData}
				session={session}
				watchList={watchList}
				checkUser={checkUser}
				watchProfile={watchProfile}
			/>
		);

		expect(screen.getByText("What's Popular")).toBeInTheDocument();
		expect(screen.getByText("My List")).toBeInTheDocument();
		expect(screen.getByText("Trending Shows")).toBeInTheDocument();
		expect(screen.getByText("Trending Movies")).toBeInTheDocument();
		expect(screen.getByText("Previews+")).toBeInTheDocument();
	});
	it("Checks NavBar items and buttons exist", async () => {
		render(
			<ProfileDashboard
				movieData={movieData}
				session={session}
				watchList={watchList}
				checkUser={checkUser}
				watchProfile={watchProfile}
			/>
		);

		expect(screen.getByTestId("navbar")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-brand")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-item-home")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-item-movies")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-item-shows")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-searchbar")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-profile-icon")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-switch-profile")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-info")).toBeInTheDocument();
		expect(screen.getByTestId("navbar-logout")).toBeInTheDocument();
	});
	it("Starts component with Home", async () => {
		render(
			<ProfileDashboard
				movieData={movieData}
				session={session}
				watchList={watchList}
				checkUser={checkUser}
				watchProfile={watchProfile}
			/>
		);

		const pageComponents = screen.getByTestId("pageComponents");
		expect(pageComponents.textContent).toBe("Home");
	});
	it("Can Change Components with NavBar Buttons", async () => {
		render(
			<ProfileDashboard
				movieData={movieData}
				session={session}
				watchList={watchList}
				checkUser={checkUser}
				watchProfile={watchProfile}
			/>
		);
		const user = userEvent.setup();

		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Home");
		await user.click(screen.getByTestId("navbar-info"));
		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Info");
		await user.click(screen.getByTestId("navbar-item-home"));
		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Home");
		expect(screen.getByTestId("dashboardState")).toHaveTextContent("Home");
		await user.click(screen.getByTestId("navbar-item-movies"));
		expect(screen.getByTestId("dashboardState")).toHaveTextContent("Movie");
		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Home");
		await user.click(screen.getByTestId("navbar-item-shows"));
		expect(screen.getByTestId("dashboardState")).toHaveTextContent("Tv");
		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Home");
	});
	it("Can activate search bar", async () => {
		render(
			<ProfileDashboard
				movieData={movieData}
				session={session}
				watchList={watchList}
				checkUser={checkUser}
				watchProfile={watchProfile}
			/>
		);
		const user = userEvent.setup();

		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Home");
		expect(screen.getByTestId("searching")).toHaveTextContent("");
		await user.type(screen.getByTestId("navbar-searchbar"), "test");
		expect(screen.getByTestId("searching")).toHaveTextContent("test");
		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Loading");
		await user.type(screen.getByTestId("navbar-searchbar"), "testers");
		expect(screen.getByTestId("searching")).toHaveTextContent("testers");
		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Loading");
		await user.click(screen.getByTestId("navbar-item-home"));
		expect(screen.getByTestId("pageComponents")).toHaveTextContent("Home");
		expect(screen.getByTestId("searching")).toHaveTextContent("");
	});
	// it("Opens the Modal when clicking on an image card", async () => {
	// 	// TODO: Fix test
	// 	render(
	// 		<ProfileDashboard
	// 			movieData={movieData}
	// 			session={session}
	// 			watchList={watchList}
	// 			checkUser={checkUser}
	// 			watchProfile={watchProfile}
	// 		/>
	// 	);
	// 	const user = userEvent.setup();
	// 	expect(screen.getByTestId("showModal")).toHaveTextContent("false");
	// 	const movieCards = screen.getAllByTestId("movie-card");
	// 	expect(movieCards.length).toBeGreaterThan(2);
	// 	console.log(movieCards);
	// 	await user.click(movieCards[1]);
	// 	await waitFor(() => {
	// 		expect(screen.getByTestId("showModal")).toHaveTextContent("true");
	// 	});
	// 	expect(screen.getByTestId("showModal")).toHaveTextContent("false");
	// });
});
