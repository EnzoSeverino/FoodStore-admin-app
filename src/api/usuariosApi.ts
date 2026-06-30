import apiClient from "./axiosInstance";
import type { PaginatedResponse } from "@/types/api";
import type { Usuario, UsuarioCreate, UsuarioUpdate } from "@/types/usuario";

const ADMIN = '/admin'

// ─── GET /api/v1/admin/usuarios
export async function getUsuarios(
    page = 1,
    size = 20,
): Promise<PaginatedResponse<Usuario>> {
    const skip = (page - 1) * size
    const response = await apiClient.get<{ items: Usuario[]; total: number; skip: number; limit: number }>(
        `${ADMIN}/usuarios`,
        { params: { skip, limit: size } }
    )
    const { items, total } = response.data
    return {
        items,
        total,
        page,
        size,
        pages: Math.ceil(total / size) || 1,
    }
}

// ─── POST /api/v1/admin/usuarios
export async function createUsuario(data: UsuarioCreate): Promise<Usuario> {
    const response = await apiClient.post<Usuario>(`${ADMIN}/usuarios`, data)
    return response.data
}

// ─── PUT /api/v1/admin/usuarios/{id}
export async function updateUsuario(id: number, data: UsuarioUpdate): Promise<Usuario> {
    const response = await apiClient.put<Usuario>(`${ADMIN}/usuarios/${id}`, data)
    return response.data
}

// ─── DELETE /api/v1/admin/usuarios/{id}
export async function deleteUsuario(id: number): Promise<void> {
    await apiClient.delete(`${ADMIN}/usuarios/${id}`)
}