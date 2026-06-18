import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

// ─── Cliente Axios configurado
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// ─── Estado del refresh
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value: unknown) => void
    reject: (reason: unknown) => void
}> = []

// Procesa la cola de requests pendientes después del refresh
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

// ─── Interceptor de Response
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            InternalAxiosRequestConfig & { _retry?: boolean }

        const url = originalRequest?.url ?? ''

        // ── Nunca intentar refresh en rutas de auth (evita loop infinito)
        const isAuthRoute = url.includes('/auth/login') ||
            url.includes('/auth/refresh') ||
            url.includes('/auth/me') ||
            url.includes('/auth/register')

        // ── 401: intentar refresh solo si no es ruta de auth
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

        // ── Otros errores: extraer mensaje del body FastAPI
        const detail =
            (error.response?.data as { detail?: string })?.detail ??
            error.message ??
            'Error desconocido'

        return Promise.reject(new Error(detail))
    },
)

export default apiClient