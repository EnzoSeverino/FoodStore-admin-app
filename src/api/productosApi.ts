import apiClient from "./axiosInstance";
import type { 
    Producto,
    ProductoCreate,
    ProductoUpdate,
    ImagenProductoUpdate,
} from "@/types/producto";
import type { Ingrediente } from "@/types/producto";
import type { PaginatedResponse } from "@/types/api";

const PRODUCTOS = '/productos'

// ─── GET /api/v1/productos
export async function getProductos(params?: {
    page?: number
    size?: number
    categoria?: number
    disponible?: boolean
    search?: string
}): Promise<PaginatedResponse<Producto>> {
    const backendParams: Record<string, unknown> = {}
  if (params?.search) backendParams.busqueda = params.search      
  if (params?.categoria) backendParams.categoria_id = params.categoria  
  if (params?.disponible !== undefined) backendParams.disponible = params.disponible
  if (params?.page) backendParams.skip = ((params.page ?? 1) - 1) * (params.size ?? 20)
  if (params?.size) backendParams.limit = params.size

  const response = await apiClient.get('/productos', { params: backendParams })
  const data = response.data

  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: params?.page ?? 1, size: params?.size ?? 20, pages: 1 }
  }

  return {
    items: data.items ?? data,
    total: data.total ?? (data.items?.length ?? 0),
    page: params?.page ?? 1,
    size: params?.size ?? 20,
    pages: Math.ceil((data.total ?? 1) / (params?.size ?? 20)),
  }
}

// ─── GET /api/v1/productos/all 
export async function getAllProductos(): Promise<Producto[]> {
    const response = await apiClient.get<Producto[]>(`${PRODUCTOS}/all`)
    return response.data
}

// ─── GET /api/v1/productos/{id}
export async function getProductoById(id: number): Promise<Producto> {
    const response = await apiClient.get<Producto>(`${PRODUCTOS}/${id}`)
    return response.data
}

// ─── POST /api/v1/productos
export async function createProducto(data: ProductoCreate): Promise<Producto> {
    const response = await apiClient.post<Producto>(PRODUCTOS, data)
    return response.data
}

// ─── PUT /api/v1/productos/{id} 
export async function updateProducto(id: number, data: ProductoUpdate): Promise<Producto> {
    const response = await apiClient.put<Producto>(`${PRODUCTOS}/${id}`, data)
    return response.data
}

// ─── PATCH /api/v1/productos/{id}/disponibilidad
export async function updateDisponibilidad(id: number, disponible: boolean): Promise<Producto> {
    const response = await apiClient.patch<Producto>(
        `${PRODUCTOS}/${id}/disponibilidad`,
        null,
    { params: { disponible } }
    )
    return response.data
}

// ─── PATCH /api/v1/productos/{id}/imagenes
export async function updateImagenes(id: number, data: ImagenProductoUpdate): Promise<Producto> {
    const response = await apiClient.patch<Producto>(`${PRODUCTOS}/${id}/imagenes`, data)
    return response.data
}

// ─── DELETE /api/v1/productos/{id}
export async function deleteProducto(id: number): Promise<void> {
    await apiClient.delete(`${PRODUCTOS}/${id}`)
}

// ─── GET /api/v1/productos/{id}/ingredientes
export async function getIngredientesByProducto(productoId: number): Promise<Ingrediente[]> {
    const response = await apiClient.get<Ingrediente[]>(`${PRODUCTOS}/${productoId}/ingredientes`)
    return response.data
}