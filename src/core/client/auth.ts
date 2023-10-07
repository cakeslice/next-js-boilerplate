import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { request } from './api'

export const useLogout = () => {
	const router = useRouter()

	const logout = useCallback(async () => {
		const { error } = await request({
			path: 'auth/logout',
			method: 'POST',
		})

		if (!error) {
			router.push('/')
		}
	}, [router])

	return { logout }
}
