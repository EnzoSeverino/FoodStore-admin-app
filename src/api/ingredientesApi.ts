import apiClient from "./axiosInstance";
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from "@/types/producto";
import type { PaginatedResponse } from "@/types/api";

const INGREDIENTES = '/ingredientes'

export async function getAllIngredientes(): Promise<Ingrediente[]> {
    const response = await apiClient.get<Ingrediente[]>(INGREDIENTES)
    return response.data
}

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

export async function createIngrediente(data: IngredienteCreate): Promise<Ingrediente> {
    const response = await apiClient.post<Ingrediente>(INGREDIENTES, data)
    return response.data
}

export async function updateIngrediente(id: number, data: IngredienteUpdate): Promise<Ingrediente> {
    const response = await apiClient.put<Ingrediente>(`${INGREDIENTES}/${id}`, data)
    return response.data
}

export async function deleteIngrediente(id: number): Promise<void> {
    await apiClient.delete(`${INGREDIENTES}/${id}`)
}
