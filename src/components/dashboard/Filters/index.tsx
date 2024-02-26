import { Checkbox, Chip, Input } from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'
import { useApi, useQueryParams } from 'core/client/api'
import { Response as CategoriesResponse } from 'pages/api/categories'
import { Query as CompanyQuery } from 'pages/api/companies'
import { useEffect, useState } from 'react'

export const Filters = () => {
	const { query, setQuery } = useQueryParams<CompanyQuery>()

	const [search, setSearch] = useState(query.search)
	const debouncedSearch = useDebounce(search, 200)

	const { data: categories } = useApi<CategoriesResponse, undefined, {}>({
		path: 'categories',
	})

	useEffect(() => {
		setQuery({ search: debouncedSearch })
	}, [debouncedSearch])

	return (
		<>
			<Input
				data-testid='dashboard.Filters.Input-search'
				className='w-auto grow min-w-[250px] max-w-[400px]'
				autoFocus
				variant='bordered'
				placeholder='Search by company name'
				defaultValue={query.search}
				onChange={(e) => {
					setSearch(e.currentTarget.value)
				}}
			/>

			<div className='flex flex-wrap items-center gap-[15px]'>
				{categories?.map((s) => (
					<Checkbox
						key={s.id}
						checked={query.categories?.includes(s.name) || false}
						onChange={(e) => {
							// TODO: Maybe with zod?
							// Otherwise we need to do Array.isArray everytime...
							let array = Array.isArray(query.categories)
								? query.categories
								: query.categories
									? [query.categories]
									: []

							if (e.currentTarget.checked) array.push(s.name)
							else array = array.filter((e) => e !== s.name)

							setQuery({ categories: array })
						}}
					>
						<Chip variant='bordered' className={s.style}>
							{s.name}
						</Chip>
					</Checkbox>
				))}
			</div>
		</>
	)
}
