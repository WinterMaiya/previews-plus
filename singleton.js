// Allow prisma testing
import { mockDeep, mockReset } from "jest-mock-extended";

import { prisma } from "./components/helper-functions/prisma";

jest.mock("./client", () => ({
	__esModule: true,
	default: mockDeep(),
}));
beforeEach(() => {
	mockReset(prismaMock);
});
export const prismaMock = prisma;
