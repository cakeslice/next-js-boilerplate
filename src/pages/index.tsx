import { Button, Link } from '@nextui-org/react'
import { PageWrapper } from 'components/PageWrapper'
import { useApi, useQueryParams } from 'core/client/api'
import { Query, Response } from 'pages/api/hello'

import { auth } from 'core/server/auth'
import type {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	InferGetServerSidePropsType,
} from 'next'

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<
	GetServerSidePropsResult<{
		loggedIn: boolean
		username: string | null
	}>
> => {
	const authRequest = auth.handleRequest(context)
	const session = await authRequest.validate()

	return {
		props: {
			loggedIn: !!session,
			username: session?.user.githubUsername || null,
		},
	}
}

const Page = ({ loggedIn, username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { query } = useQueryParams<Query>()

	const { data } = useApi<Response, Query, {}>({
		path: 'hello',
		query,
	})

	return (
		<PageWrapper>
			<div>{data?.hello}</div>

			{!loggedIn ? (
				<Link href='/login'>
					<Button>Log in</Button>
				</Link>
			) : (
				<Link href='/dashboard'>
					<Button>{username}</Button>
				</Link>
			)}
		</PageWrapper>
	)
}

export default Page
