// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Post } from '@prisma/client'
import prisma from 'core/server/prisma'
import { NextApiRequestTyped } from 'core/server/types'
import { Company, companiesData, zodCategories } from 'models/company'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

const QuerySchema = z.object({
	search: z.optional(z.string()),
	categories: zodCategories,
})
export type Query = z.infer<typeof QuerySchema>

export type Response =
	| {
			companies: Company[]
	  }
	| undefined

// TODO: Pagination & infinite loading for mobile (with scroll to top on page change) - Middleware

// Next.js endpoints accept all HTTP methods (GET, POST...)
export default async function handler(
	req: NextApiRequestTyped<Query>,
	res: NextApiResponse<Response>
) {
	// TODO: Move to middleware and also .setHeader('message', error...)
	const query = QuerySchema.parse(req.query)
	if (!query) return res.status(400).send(undefined)

	let output: Response = { companies: companiesData }

	const search = query.search
	if (search)
		output.companies = output.companies.filter((c) =>
			c.name.toLowerCase().includes(search.toLowerCase())
		)

	const categories = query.categories || []
	if (categories && categories.length > 0) {
		output.companies = output.companies.filter((c) => {
			let found = false

			c.categories.forEach((s) => {
				if (categories.includes(s)) found = true
			})

			return found
		})
	}

	//

	const feed: Post[] = await prisma.post.findMany({
		where: { published: true },
		include: {
			author: {
				select: { name: true },
			},
		},
	})

	//

	res.status(200).json(output)
}
