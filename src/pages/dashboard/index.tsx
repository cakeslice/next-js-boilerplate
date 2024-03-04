import {
	Button,
	Pagination,
	Spacer,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react'
import { PageWrapper } from 'components/PageWrapper'
import { Cell } from 'components/dashboard/Cell'
import DashboardWrapper from 'components/dashboard/DashboardWrapper'
import { Filters } from 'components/dashboard/Filters'
import { request, useApi, useQueryParams } from 'core/client/api'
import { useLogout } from 'core/client/auth'
import { Desktop, Mobile, useBreakpoint } from 'core/client/components/MediaQuery'
import { ThemeToggle } from 'core/client/components/ThemeToggle'
import { usePagination } from 'core/client/hooks'
import { auth } from 'core/server/auth'
import type {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	InferGetServerSidePropsType,
} from 'next'
import { Body as AddDataBody, Response as AddDataResponse } from 'pages/api/add-data'
import {
	Response as CompaniesResponse,
	Query as CompanyQuery,
	QuerySchema as CompanySchema,
} from 'pages/api/companies'
import { useMemo, useState } from 'react'
import { Client } from 'react-hydration-provider'

const columns = [
	{ name: 'COMPANY', uid: 'name' },
	{ name: 'CATEGORIES', uid: 'categories', desktop: true },
	{ name: 'CITY', uid: 'city', desktop: true },
	{ name: 'INFO', uid: 'info', mobile: true },
]

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<
	GetServerSidePropsResult<{
		userId: string
		username: string
	}>
> => {
	const authRequest = auth.handleRequest(context)
	const session = await authRequest.validate()
	if (!session) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}
	return {
		props: {
			userId: session.user.userId,
			username: session.user.githubUsername,
		},
	}
}

const Dashboard = ({ username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [filtersOpen, setFiltersOpen] = useState(false)

	const { query, setQuery } = useQueryParams(CompanySchema)

	const { data, refetch, isLoading } = useApi<CompaniesResponse, CompanyQuery, {}>({
		path: 'companies',
		query,
	})

	const { companies, totalItems } = data || {}

	const sendData = async () => {
		const { result, error } = await request<AddDataResponse, {}, AddDataBody>({
			path: 'add-data',
			method: 'POST',
			body: {
				hello: true,
			},
		})
		if (error) alert(error.message)
		else console.log('Message from server: ' + result?.message)
	}

	const { logout } = useLogout()

	const mobile = useBreakpoint('mobile')

	const responsiveColumns = useMemo(
		() => columns.filter((c) => (mobile ? !c.desktop : !c.mobile)),
		[mobile]
	)

	const { pages } = usePagination(data?.totalItems, 10)

	return (
		<PageWrapper>
			<DashboardWrapper>
				<div className='flex gap-4'>
					<div>Hello, {username}</div>
					<Button onClick={logout}>Logout</Button>
				</div>

				<Spacer y={10} />

				<div className='flex flex-wrap justify-between items-center gap-x-8 gap-y-4 '>
					<Desktop>
						<Filters />
						<div className='flex gap-3'>
							<ThemeToggle />
							<Button
								className='d-button-primary'
								onClick={async () => {
									await sendData()
									await refetch()
								}}
							>
								New
							</Button>
						</div>
					</Desktop>
					<Mobile>
						<Button
							className='d-button-secondary'
							onClick={() => setFiltersOpen((o) => !o)}
						>
							Filters
						</Button>
						<ThemeToggle />
					</Mobile>

					{filtersOpen && (
						<div className='flex flex-col desktop:hidden gap-[15px]'>
							<Filters />
						</div>
					)}
				</div>

				<Spacer y={5} />

				<Client>
					<Table
						bottomContent={
							pages > 0 ? (
								<div className='flex w-full justify-center'>
									<Pagination
										isCompact
										showControls
										showShadow
										color='primary'
										page={query.page || 1}
										total={pages}
										onChange={(page) => {
											setQuery({ page }), window.scrollTo(0, 0)
										}}
									/>
								</div>
							) : null
						}
						hideHeader={mobile}
						aria-label='Companies table'
					>
						<TableHeader columns={responsiveColumns}>
							{(column) => (
								<TableColumn
									width={
										column.uid === 'city'
											? '25%'
											: column.uid === 'categories'
												? 310
												: undefined
									}
									key={column.uid}
								>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>

						<TableBody
							isLoading={isLoading}
							emptyContent='No results...'
							loadingContent={<Spinner />}
							items={companies || []}
						>
							{(item) => (
								<TableRow key={item.name}>
									{(columnKey) => (
										<TableCell>{Cell(item, `${columnKey}`)}</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Client>
			</DashboardWrapper>
		</PageWrapper>
	)
}

export default Dashboard
