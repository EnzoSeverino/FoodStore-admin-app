import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

let isRefreshing = false
let failedQueue: Array<{
    resolve: (value: unknown) => void
    reject: (reason: unknown) => void
}> = []

function processQueue(error: AxiosError | null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error)
        } else {
            resolve(undefined)
        }
    })
    failedQueue = []
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            InternalAxiosRequestConfig & { _retry?: boolean }

        const url = originalRequest?.url ?? ''

        const isAuthRoute = url.includes('/auth/login') ||
            url.includes('/auth/refresh') ||
            url.includes('/auth/me') ||
            url.includes('/auth/register')

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    return apiClient(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const { requestRefresh } = await import('@/api/authApi')
                await requestRefresh()
                processQueue(null)
                return apiClient(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError as AxiosError)
                const { useAuthStore } = await import('@/stores/authStore')
                useAuthStore.getState().clearSession()
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        const responseData = error.response?.data as { detail?: unknown }
        const detail = responseData?.detail

        let mensaje: string

        if (typeof detail === 'string') {
            mensaje = detail
        } else if (Array.isArray(detail)) {
            mensaje = detail
                .map((e: { loc?: string[]; msg?: string }) =>
                e.loc ? `${e.loc.slice(1).join('.')}: ${e.msg}` : e.msg ?? 'Error desconocido'
                )
                .join(' | ')
        } else {
            mensaje = error.message ?? 'Error desconocido'
        }

        return Promise.reject(new Error(mensaje))
    },
)

export default apiClient
