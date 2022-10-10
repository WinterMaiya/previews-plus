import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Handler from "../../../pages/api/list/[id]";
import { CarouselItem } from "react-bootstrap";
import { useSession } from "next-auth/react";

// Testing help provided from https://github.com/nextauthjs/next-auth/discussions/4185
// jest.mock("next-auth/react", () => {
// 	const originalModule = jest.requireActual("next-auth/react");
// 	const mockSession = {
// 		expires: new Date(Date.now() + 2 * 86400).toISOString(),
// 		user: { username: "admin" },
// 	};
// 	return {
// 		__esModule: true,
// 		...originalModule,
// 		useSession: jest.fn(() => {
// 			return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
// 		}),
// 	};
// });

// describe("List Api", () => {
// 	// List api
// 	// TODO
// 	test("expect a response", async () => {
// 		const mockSession = (Session = {
// 			expires: "1",
// 			user: { email: "test@test.com", name: "Test" },
// 		});
// 		const req = {
// 			webToken: useSession(),
// 			query: {
// 				id: 1,
// 				profile: 1,
// 				movieTitle: "Test Title",
// 				moviePoster: "Test Poster",
// 				typeOf: "movie",
// 			},
// 		};

// 		const json = jest.fn();
// 		const status = jest.fn(() => {
// 			return {
// 				json,
// 			};
// 		});
// 		const res = {
// 			status,
// 		};

// 		await waitFor(() => Handler(req, res));

// 		console.log(json.mock);
// 		expect(status).toBe(400);
// 	});
// });
