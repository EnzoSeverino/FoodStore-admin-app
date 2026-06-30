// ─── Autenticación
export interface LoginRequest {
    email: string
    password: string
}

export interface UserPublic {
    id: number
    nombre: string
    apellido: string | null
    email: string
    rol: string
    celular: string | null
}

export interface TokenResponse {
    access_token: string
    refresh_token: string
    usuario: UserPublic   
}

// Error estándar RFC 7807 que devuelve FastAPI
export interface ApiError {
    detail: string
    code?: string
    field?: string
}

// Respuesta paginada genérica — se usa con cualquier entidad
export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    size: number
    pages: number
}