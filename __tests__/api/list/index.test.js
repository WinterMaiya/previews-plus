import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Handler from "../../../pages/api/list/[id]";
import { CarouselItem } from "react-bootstrap";

describe("List Api", () => {
	// List api
	// TODO
	test("expect a response", () => {
		const req = {};

		const res = {};

		Handler(req, res);
	});
});
