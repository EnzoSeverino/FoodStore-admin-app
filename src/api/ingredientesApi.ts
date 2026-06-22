import apiClient from "./axiosInstance";
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from "@/types/producto";
import type { PaginatedResponse } from "@/types/api";

const INGREDIENTES = '/ingredientes'

// ─── GET /api/v1/ingredientes
// El backend no pagina este recurso: siempre devuelve la lista completa.
export async function getAllIngredientes(): Promise<Ingrediente[]> {
    const response = await apiClient.get<Ingrediente[]>(INGREDIENTES)
    return response.data
}

// ─── Paginación client-side sobre el resultado completo de /ingredientes
export async function getIngredientes(
    page = 1,
    size = 20,
): Promise<PaginatedResponse<Ingrediente>> {
    const items = await getAllIngredientes()

    const start = (page - 1) * size
    const paginados = items.slice(start, start + size)

    return {
        items: paginados,
        total: items.length,
        page,
        size,
        pages: Math.ceil(items.length / size) || 1,
    }
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