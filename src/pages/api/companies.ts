// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Category, Company } from '@prisma/client'
import prisma from 'core/server/prisma'
import { NextApiRequestTyped } from 'core/server/types'
import { validate, zodQueryArray } from 'core/server/zod'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

export const QuerySchema = z.object({
	search: z.optional(z.string()),
	categories: z.optional(zodQueryArray(z.string())),
})
export type Query = z.infer<typeof QuerySchema>

export type CompanyWithCategories = Company & { categories: Category[] }
export type Response = CompanyWithCategories[] | undefined

// TODO: Pagination & infinite loading for mobile (with scroll to top on page change) - Middleware

// Next.js endpoints accept all HTTP methods (GET, POST...)
export default async function handler(
	req: NextApiRequestTyped<Query>,
	res: NextApiResponse<Response>
) {
	const query = validate({ schema: QuerySchema, obj: req.query, res })
	if (!query) return

	const search = query.search
	const categories = query.categories || []

	const foundCompanies = await prisma.company.findMany({
		where: {
			...(search && {
				name: { contains: search?.toLowerCase(), mode: 'insensitive' },
			}),
			...(categories.length > 0 && {
				categories: {
					some: {
						category: {
							name: {
								in: categories,
							},
						},
					},
				},
			}),
		},
		include: {
			categories: {
				include: {
					category: true,
				},
			},
		},
	})

	let output: Response = foundCompanies.map((c) => ({
		...c,
		categories: c.categories.map((cat) => cat.category),
	}))

	res.status(200).json(output)
}
