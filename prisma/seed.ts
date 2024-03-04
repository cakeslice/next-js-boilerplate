import { createPrismaClient } from 'core/server/prisma'

const prisma = createPrismaClient()

const companyCategories: {
	id?: number
	name: string
	style: string
}[] = [
	{
		name: 'Excavation',
		style: 'bg-orange-300 dark:bg-orange-700',
	},
	{
		name: 'Electrical',
		style: 'bg-pink-300 dark:bg-pink-700',
	},
	{
		name: 'Plumbing',
		style: 'bg-cyan-300 dark:bg-cyan-700',
	},
]

const companies = [
	{
		name: 'Construct-X',
		logo: '',
		categories: ['Excavation'],
		city: 'Lisbon',
	},
	{
		name: 'Buildify',
		logo: '',
		categories: ['Electrical', 'Plumbing'],
		city: 'Essen',
	},
	{
		name: 'Meta-Builders',
		logo: '',
		categories: ['Electrical', 'Excavation'],
		city: 'Munich',
	},
	{
		name: 'Brick-by-Brick',
		logo: '',
		categories: ['Plumbing'],
		city: 'Berlin',
	},
]

async function main() {
	for (let i = 0; i < companyCategories.length; i++) {
		const c = companyCategories[i]

		const object = await prisma.category.upsert({
			where: { name: c.name },
			update: {},
			create: {
				...c,
			},
		})
		c.id = object.id
	}

	for (let i = 0; i < companies.length; i++) {
		const c = companies[i]

		const categories = companies[i].categories.map((cat) => {
			const foundCategory = companyCategories.find((j) => j.name === cat)

			return foundCategory
		})

		await prisma.company.upsert({
			where: { name: c.name },
			update: {},
			create: {
				...c,
				categories: {
					create: categories.map((cat) => ({
						category: {
							connect: {
								id: cat?.id,
							},
						},
					})),
				},
			},
		})
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
