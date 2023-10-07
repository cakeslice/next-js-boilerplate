import { Button, Link } from '@nextui-org/react'
import PageWrapper from 'components/PageWrapper'
import { auth } from 'core/server/auth'

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> => {
	const authRequest = auth.handleRequest(context)
	const session = await authRequest.validate()
	if (session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},
		}
	}
	return {
		props: {},
	}
}

const Page = () => {
	return (
		<PageWrapper>
			<Link href='/api/auth/github'>
				<Button>Sign in with GitHub</Button>
			</Link>
		</PageWrapper>
	)
}

export default Page
