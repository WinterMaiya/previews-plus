// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

const esModules = ["@agm", "ngx-bootstrap", "lodash-es"].join("|");

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	// if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
	moduleDirectories: ["node_modules", "<rootDir>/"],
	testEnvironment: "jest-environment-jsdom",
	collectCoverage: true,
	// on node 14.x coverage provider v8 offers good speed and more or less good report
	coverageProvider: "v8",
	collectCoverageFrom: [
		"**/*.{js,jsx,ts,tsx}",
		"!**/*.d.ts",
		"!**/node_modules/**",
		"!<rootDir>/out/**",
		"!<rootDir>/.next/**",
		"!<rootDir>/*.config.js",
		"!<rootDir>/coverage/**",
	],
	moduleNameMapper: {
		// Handle CSS imports (with CSS modules)
		// https://jestjs.io/docs/webpack#mocking-css-modules
		"^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

		// Handle CSS imports (without CSS modules)
		"^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

		// Handle image imports
		// https://jestjs.io/docs/webpack#handling-static-assets
		"^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i": `<rootDir>/__mocks__/fileMock.js`,

		// Handle module aliases
		"^@/components/(.*)$": "<rootDir>/components/$1",
		"^@web/assets/(.*)$": "<rootDir>/packages/web/src/assets/$1",
		// "swiper/react": "swiper/react/swiper-react.js",
		// "swiper/css": "swiper/swiper.min.css",
	},
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/.next/",
		"/node_modules/(?!react-dnd|dnd-core|@react-dnd)",
	],
	testEnvironment: "jsdom",
	transform: {
		// Use babel-jest to transpile tests with the next/babel preset
		// https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
		"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
		"^.+\\.ts?$": "ts-jest",
		"node_modules/(react-dnd|dnd-core|@react-dnd)/.+\\.(j|t)sx?$": "ts-jest",
		[`(${esModules}).+\\.js$`]: "babel-jest",
	},
	transformIgnorePatterns: [
		"/node_modules/",
		"^.+\\.module\\.(css|sass|scss)$",
		`/node_modules/(?!${esModules})`,
		"node_modules/(?!(swiper|ssr-window|dom7)/)",
		"node_modules/(?!swiper|ssr-window|dom7).*/",
	],
	extensionsToTreatAsEsm: [".esm.js"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => ({
	/**
	 * Using ...(await createJestConfig(customJestConfig)()) to override transformIgnorePatterns
	 * provided byt next/jest.
	 *
	 * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096635363
	 */
	...(await createJestConfig(customJestConfig)()),
	/**
	 * Swiper uses ECMAScript Modules (ESM) and Jest provides some experimental support for it
	 * but "node_modules" are not transpiled by next/jest yet.
	 *
	 * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096698456
	 * @link https://jestjs.io/docs/ecmascript-modules
	 */
	transformIgnorePatterns: ["node_modules/(?!(swiper|ssr-window|dom7)/)"],
});
