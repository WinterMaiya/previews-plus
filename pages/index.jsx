import Head from "next/head";
import { getSession } from "next-auth/react";

const PreviewsPlus = () => {
	return (
		<div>
			<Head>
				<title>Previews+</title>
			</Head>
			<div>You shouldn{`&apos;`}t be here...</div>
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
