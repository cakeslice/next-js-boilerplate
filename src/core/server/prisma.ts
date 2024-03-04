import { Prisma, PrismaClient } from '@prisma/client'

export const createPrismaClient = () =>
	new PrismaClient().$extends({
		name: 'findManyAndCount',
		model: {
			$allModels: {
				findManyAndCount<Model, Args>(
					this: Model,
					args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>
				): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
					return prisma.$transaction([
						(this as any).findMany(args),
						(this as any).count({ where: (args as any).where }),
					]) as any
				},
			},
		},
	})
type ExtendedPrisma = ReturnType<typeof createPrismaClient>

declare global {
	var prisma: ExtendedPrisma
}

export let prisma: ExtendedPrisma

if (typeof window === 'undefined') {
	if (process.env.NODE_ENV === 'production') {
		prisma = createPrismaClient()
	} else {
		if (!global.prisma) {
			global.prisma = createPrismaClient()
		}
		prisma = global.prisma
	}
}
