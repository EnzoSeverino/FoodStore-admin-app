import apiClient from "./axiosInstance";
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from "@/types/producto";
import type { PaginatedResponse } from "@/types/api";

const INGREDIENTES = '/ingredientes'

// ─── GET /api/v1/ingredientes
export async function getIngredientes(
    page = 1,
    size = 20,
): Promise<PaginatedResponse<Ingrediente>> {
    const response = await apiClient.get<Ingrediente[]>(INGREDIENTES, {
        params: { skip: (page - 1) * size, limit: size },
    })

    const items = response.data

    return {
        items,
        total: items.length,
        page,
        size,
        pages: Math.ceil(items.length / size) || 1,
    }
}

// ─── GET /api/v1/ingredientes/all
export async function getAllIngredientes(): Promise<Ingrediente[]> {
    const response = await apiClient.get<Ingrediente[]>(`${INGREDIENTES}`)
    return response.data
}

// ─── POST /api/v1/ingredientes
export async function createIngrediente(data: IngredienteCreate): Promise<Ingrediente> {
    const response = await apiClient.post<Ingrediente>(INGREDIENTES, data)
    return response.data
}

// ─── PUT /api/v1/ingredientes/{id} 
export async function updateIngrediente(id: number, data: IngredienteUpdate): Promise<Ingrediente> {
    const response = await apiClient.put<Ingrediente>(`${INGREDIENTES}/${id}`, data)
    return response.data
}

// ─── DELETE /api/v1/ingredientes/{id}
export async function deleteIngrediente(id: number): Promise<void> {
    await apiClient.delete(`${INGREDIENTES}/${id}`)
}