import Head from "next/head";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

const PreviewsPlus = ({ session }) => {
	return (
		<div>
			<Head>
				<title>Previews+</title>
			</Head>
			<div>Hello World</div>
		</div>
	);
};

export async function getServerSideProps({ req }) {
	const session = await getSession({ req });

	if (session) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}
	if (!session) {
		return {
			redirect: {
				destination: "/welcome",
				permanent: false,
			},
		};
	}
	return {
		props: {
			session,
		},
	};
}

export default PreviewsPlus;
