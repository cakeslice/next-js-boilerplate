// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Category } from '@prisma/client'
import prisma from 'core/server/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export type Response = Category[] | undefined

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	const categories = await prisma.category.findMany()

	res.status(200).json(categories)
}
