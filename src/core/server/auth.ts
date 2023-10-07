import { prisma } from '@lucia-auth/adapter-prisma'
import { github } from '@lucia-auth/oauth/providers'
import { PrismaClient } from '@prisma/client'
import { lucia } from 'lucia'
import { nextjs_future } from 'lucia/middleware'

const client = new PrismaClient()

export const auth = lucia({
	adapter: prisma(client, {
		user: 'user',
		session: 'userSession',
		key: 'userKey',
	}),
	env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
	middleware: nextjs_future(),
	getUserAttributes: (data) => {
		return {
			githubUsername: data.username,
		}
	},
})

export const githubAuth = github(auth, {
	clientId: process.env.GITHUB_ID ?? '',
	clientSecret: process.env.GITHUB_SECRET ?? '',
})

export type Auth = typeof auth
