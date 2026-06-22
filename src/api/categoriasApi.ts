import apiClient from "./axiosInstance";
import type { Categoria, CategoriaCreate, CategoriaUpdate } from "@/types/categoria";
import type { PaginatedResponse } from "@/types/api";

const CATEGORIAS = '/categorias'

// ─── GET /api/v1/categorias/all
// Trae todas las categorías sin filtro, incluyendo hijas — usado como fuente
// única de datos: getCategorias pagina sobre este mismo resultado.
export async function getAllCategorias(): Promise<Categoria[]> {
    const response = await apiClient.get<Categoria[]>(`${CATEGORIAS}/all`)
    return response.data
}

// ─── GET /api/v1/categorias (paginado client-side)
// El backend no expone paginación real para categorías con jerarquía,
// así que paginamos sobre el resultado completo de /all.
export async function getCategorias(
    page = 1,
    size = 20,
): Promise<PaginatedResponse<Categoria>> {
    const items = await getAllCategorias()

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

// ─── POST /api/v1/categorias
export async function createCategoria(data: CategoriaCreate): Promise<Categoria> {
    const response = await apiClient.post<Categoria>(CATEGORIAS, data)
    return response.data
}

// ─── PUT /api/v1/categorias/{id}
export async function updateCategoria(id: number, data: CategoriaUpdate): Promise<Categoria> {
    const response = await apiClient.put<Categoria>(`${CATEGORIAS}/${id}`, data)
    return response.data
}

// ─── DELETE /api/v1/categorias/{id}
export async function deleteCategoria(id: number): Promise<void> {
    await apiClient.delete(`${CATEGORIAS}/${id}`)
}