import apiClient from "./axiosInstance";
import type { PaginatedResponse } from "@/types/api";

interface UsuarioBackend {
    id: number
    email: string
    nombre: string
    rol: string
    deleted_at: string | null
}

export interface UsuarioAdmin {
    id: number
    email: string
    nombre: string
    rol: string
    deleted_at: string | null
}

export interface UsuarioAdminCreate {
    email: string
    password: string
    nombre: string
    rol: string
}

export interface UsuarioAdminUpdate {
    nombre?: string
    email?: string
    rol?: string
}

const ADMIN = '/admin'

// ─── GET /api/v1/admin/usuarios
export async function getUsuarios(
    page = 1,
    size = 20,
): Promise<PaginatedResponse<UsuarioAdmin>> {
    const skip = (page - 1) * size
    const response = await apiClient.get<{ items: UsuarioBackend[]; total: number; skip: number; limit: number }>(
        `${ADMIN}/usuarios`,
        { params: { skip, limit: size } }
    )
    const { items, total } = response.data
    return {
        items,
        total,
        page,
        size,
        pages: Math.ceil(total / size),
    }
}

// ─── POST /api/v1/admin/usuarios
export async function createUsuario(data: UsuarioAdminCreate): Promise<UsuarioAdmin> {
    const response = await apiClient.post<UsuarioAdmin>(`${ADMIN}/usuarios`, data)
    return response.data
}

// ─── PUT /api/v1/admin/usuarios/{id} 
export async function updateUsuario(id: number, data: UsuarioAdminUpdate): Promise<UsuarioAdmin> {
    const response = await apiClient.put<UsuarioAdmin>(`${ADMIN}/usuarios/${id}`, data)
    return response.data
}

// ─── DELETE /api/v1/admin/usuarios/{id}
export async function deleteUsuario(id: number): Promise<void> {
    await apiClient.delete(`${ADMIN}/usuarios/${id}`)
}