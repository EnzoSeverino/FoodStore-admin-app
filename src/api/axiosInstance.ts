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
        const responseData = error.response?.data as { detail?: unknown }
        const detail = responseData?.detail

        let mensaje: string

        if (typeof detail === 'string') {
            // Error simple: { detail: "mensaje" }
            mensaje = detail
        } else if (Array.isArray(detail)) {
            // Error de validación Pydantic: array de { loc, msg, type }
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