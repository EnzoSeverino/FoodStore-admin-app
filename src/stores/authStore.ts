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
        set({ user: null, isAuthenticated: false, isLoading: false }),

    checkAuth: async () => {
        const { requestRefresh } = await import('@/api/authApi')
        try {
            // Usar refresh para obtener un nuevo access token y setearlo
            const tokenResponse = await requestRefresh()
            const { requestMe } = await import('@/api/authApi')
            const user = await requestMe()
            set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false,
                accessToken: tokenResponse.access_token  // ← guardar el token
            })
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null })
        }
    },

    login: async (email, password) => {
        const { requestLogin, requestMe } = await import('@/api/authApi')
        try {
            const tokenResponse = await requestLogin(email, password)
            const user = await requestMe()
            set({ user, isAuthenticated: true, error: null, accessToken: tokenResponse.access_token })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
            set({ error: message })
            throw error
        }
    },

    logout: async () => {
        const { requestLogout} = await import('@/api/authApi')
        try {
            await requestLogout()
        } finally {
            set({ user: null, isAuthenticated: false })
        }
    },
}))