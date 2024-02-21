import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Filters } from '.'

it('renders the search input', () => {
	render(<Filters />)

	const input = screen.getByTestId('dashboard.Filters.Input-search')

	expect(input).toBeInTheDocument()
	expect(input).toBeEnabled()
})
