import { create } from 'zustand'
import type { UserPublic } from '@/types/api'

interface AuthState {
    user: UserPublic | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    accessToken: string | null
    setError: (error: string | null) => void
    checkAuth: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    accessToken: null,

    setError: (error) => set({ error }),

    clearSession: () =>
        set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null }),

    checkAuth: async () => {
        const { requestRefresh } = await import('@/api/authApi')
        try {
            const tokenResponse = await requestRefresh()
            set({
                user: tokenResponse.usuario,
                isAuthenticated: true,
                isLoading: false,
                accessToken: tokenResponse.access_token,
            })
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null })
        }
    },

    login: async (email, password) => {
        const { requestLogin } = await import('@/api/authApi')
        try {
            const tokenResponse = await requestLogin(email, password)
            set({
                user: tokenResponse.usuario,
                isAuthenticated: true,
                error: null,
                accessToken: tokenResponse.access_token,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
            set({ error: message })
            throw error
        }
    },

    logout: async () => {
        const { requestLogout } = await import('@/api/authApi')
        try {
            await requestLogout()
        } finally {
            set({ user: null, isAuthenticated: false, accessToken: null })
        }
    },
}))