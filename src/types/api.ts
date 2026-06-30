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

export interface ApiError {
    detail: string
    code?: string
    field?: string
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    size: number
    pages: number
}
