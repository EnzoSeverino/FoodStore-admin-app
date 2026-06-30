import apiClient from "./axiosInstance";
import type { UserPublic, TokenResponse, LoginRequest } from "@/types/api";

const AUTH = '/auth'

interface BackendUserPublic {
    id: number
    nombre: string
    apellido: string | null
    email: string
    celular: string | null
    roles: string[]   
}

function mapUser(u: BackendUserPublic): UserPublic {
    return {
        id: u.id,
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        celular: u.celular,
        rol: u.roles?.[0]?.toUpperCase() ?? 'CLIENT',  
    }
}

export async function requestLogin(
    email: string,
    password: string
): Promise<TokenResponse> {
    const body: LoginRequest = { email, password }
    const response = await apiClient.post<{
        access_token: string
        refresh_token: string
        usuario: BackendUserPublic
    }>(`${AUTH}/login`, body)

    if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token)
    }

    return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        usuario: mapUser(response.data.usuario),
    }
}

export async function requestRefresh(): Promise<TokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token')

    const response = await apiClient.post<{
        access_token: string
        refresh_token: string
        usuario: BackendUserPublic
    }>(`${AUTH}/refresh`, refreshToken ? { refresh_token: refreshToken } : {})

    if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token)
    }

    return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        usuario: mapUser(response.data.usuario),
    }
}

export async function requestMe(): Promise<UserPublic> {
    const response = await apiClient.get<BackendUserPublic>(`${AUTH}/me`)
    return mapUser(response.data)
}

export async function requestLogout(): Promise<void> {
    localStorage.removeItem('refresh_token')
    await apiClient.post(`${AUTH}/logout`)
}
