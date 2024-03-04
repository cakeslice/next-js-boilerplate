import { Checkbox, Chip } from '@nextui-org/react'
import { useApi, useQueryParams } from 'core/client/api'
import { Input } from 'core/client/components/Input'
import { Response as CategoriesResponse } from 'pages/api/categories'
import { QuerySchema as CompanySchema } from 'pages/api/companies'

export const Filters = () => {
	const { data: categories } = useApi<CategoriesResponse, undefined, {}>({
		path: 'categories',
	})

	const { query, setQuery, queryReady } = useQueryParams(CompanySchema)

	return (
		<>
			{queryReady && (
				<Input
					debounced
					data-testid='dashboard.Filters.Input-search'
					className='w-auto grow min-w-[250px] max-w-[400px]'
					variant='bordered'
					placeholder='Search by company name'
					defaultValue={query.search}
					classNames={{
						inputWrapper: 'd-input-primary',
					}}
					onChange={(e) => {
						setQuery({ search: e })
					}}
				/>
			)}

			<div className='flex flex-wrap items-center gap-[15px]'>
				{queryReady &&
					categories?.map((s) => (
						<Checkbox
							key={s.id}
							defaultSelected={query.categories?.includes(s.name) || false}
							onChange={(e) => {
								let array = query.categories || []

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
