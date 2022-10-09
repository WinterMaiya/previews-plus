import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";

const NavBar = ({
	searching,
	setSearching,
	setDashboardState,
	watchProfile,
	setPageComponents,
}) => {
	// Navbar for the user to search, change tabs, and edit or change profiles.
	const searchMovies = (val) => {
		setSearching(val);
	};

	const clearSearchBar = () => {
		setSearching("");
	};
	return (
		<nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top align-middle mb-5">
			<div className="container-md content-align-center">
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarTogglerDemo03"
					aria-controls="navbarTogglerDemo03"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<a
					className="navbar-brand text-primary satisfy-font"
					href="#"
					onClick={() => {
						clearSearchBar();
						setDashboardState("Home");
					}}
				>
					Previews+
				</a>
				<div className="collapse navbar-collapse" id="navbarTogglerDemo03">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<a
								className="nav-link active"
								onClick={() => {
									clearSearchBar();
									setDashboardState("Home");
									setPageComponents("Home");
								}}
								aria-current="page"
								href="#"
							>
								Home
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link active"
								onClick={() => {
									clearSearchBar();
									setDashboardState("Movie");
									setPageComponents("Home");
								}}
								aria-current="page"
								href="#"
							>
								Movies
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link active"
								onClick={() => {
									clearSearchBar();
									setDashboardState("Tv");
									setPageComponents("Home");
								}}
								aria-current="page"
								href="#"
							>
								Shows
							</a>
						</li>
					</ul>

					<form
						class="d-flex"
						role="search"
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<input
							class="form-control me-2"
							type="search"
							placeholder="Search"
							aria-label="Search"
							onChange={(e) => {
								searchMovies(e.target.value);
							}}
							value={searching}
						/>
					</form>
					<ul className="navbar-nav">
						<li class="nav-item dropdown">
							<a
								class="nav-link dropdown-toggle align-middle"
								href="#"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<Image
									src={watchProfile.profile_pic}
									alt=""
									className="shadow img-thumbnail border-2 border-bottom"
									width={40}
									height={40}
								/>
							</a>
							<ul
								class="dropdown-menu dropdown-menu-dark dropdown-menu-end"
								aria-labelledby="navbarDropdown"
							>
								<li>
									<a class="dropdown-item" href="/dashboard">
										Switch Profile
									</a>
								</li>
								<li>
									<a
										class="dropdown-item"
										href="#"
										onClick={() => {
											clearSearchBar();
											setPageComponents("Info");
										}}
									>
										App & API info
									</a>
								</li>
								<li>
									<a class="dropdown-item bg-danger" href="#" onClick={signOut}>
										Logout
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
