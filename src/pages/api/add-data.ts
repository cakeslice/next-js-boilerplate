import { NextApiRequestTyped } from 'core/server/types'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

const BodySchema = z.object({
	hello: z.boolean(),
})
export type Body = z.infer<typeof BodySchema>

export type Response =
	| {
			helloSuccess: string
	  }
	| undefined

export default async function handler(
	req: NextApiRequestTyped<undefined, Body>,
	res: NextApiResponse<Response>
) {
	if (!BodySchema.parse(req.body)) return res.status(400).send(undefined)

	await prisma.company.create({
		data: {
			name: 'Company #' + Math.floor(Math.random() * 1000),
			city: 'Tokyo',
		},
	})

	let output: Response = { helloSuccess: 'Hello World!' }

	res.status(200).json(output)
}
