import { t } from '@lingui/macro'
import { Checkbox, Chip } from '@nextui-org/react'
import { useQueryParams } from 'core/client/api'
import { Input } from 'core/client/components/Input'
import { allCategories, categoryStyle } from 'models/company'
import { QuerySchema as CompanySchema } from 'pages/api/companies'

export const Filters = () => {
	const { query, setQuery, queryReady } = useQueryParams(CompanySchema)

	return (
		<>
			{queryReady && (
				<Input
					debounced
					data-testid='dashboard.Filters.Input-search'
					className='w-auto grow min-w-[250px] max-w-[400px]'
					variant='bordered'
					placeholder={t`Search by company name`}
					defaultValue={query.search}
					classNames={{
						inputWrapper: 'd-input-primary',
					}}
					onChange={(e) => {
						setQuery({ search: e, page: 1 })
					}}
				/>
			)}

			<div className='flex flex-wrap items-center gap-[15px]'>
				{queryReady &&
					allCategories.map((s) => (
						<Checkbox
							key={s}
							defaultSelected={query.categories?.includes(s) || false}
							onChange={(e) => {
								let array = query.categories || []

								if (e.currentTarget.checked) {
									if (array.indexOf(s) === -1) array.push(s)
								} else array = array.filter((e) => e !== s)

								setQuery({ categories: array, page: 1 })
							}}
						>
							<Chip variant='bordered' className={categoryStyle[s]}>
								{s}
							</Chip>
						</Checkbox>
					))}
			</div>
		</>
	)
}
