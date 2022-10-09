import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import WelcomePage from "../../pages/welcome";

describe("Welcome Page", () => {
	// Finish test when welcome page is created
	it("Snapshot", async () => {
		const { container } = render(<WelcomePage />);
		expect(container).toMatchSnapshot();
	});
});
