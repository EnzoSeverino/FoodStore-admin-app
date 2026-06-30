import apiClient from "./axiosInstance";
import type { 
    PedidoRead,
    PedidoDetail,
    EstadoPedido,
    HistorialEstadoPedido,
} from "@/types/pedido";
import type { PaginatedResponse } from "@/types/api";

const PEDIDOS = '/pedidos'

export async function getPedidos(params?: {
    page?: number
    size?: number
    estado_codigo?: string
}): Promise<PaginatedResponse<PedidoRead>> {
    const response = await apiClient.get<PedidoRead[]>(PEDIDOS)  
    const items = response.data

    const filtrados = params?.estado_codigo
        ? items.filter(p => p.estado_actual?.codigo === params.estado_codigo)
        : items

    const page = params?.page ?? 1
    const size = params?.size ?? 20
    const start = (page - 1) * size
    const paginados = filtrados.slice(start, start + size)

    return {
        items: paginados,
        total: filtrados.length,
        page,
        size,
        pages: Math.ceil(filtrados.length / size) || 1,
    }
}

export async function getPedidoById(id: number): Promise<PedidoDetail> {
    const response = await apiClient.get<PedidoDetail>(`${PEDIDOS}/${id}`)
    return response.data
}

export async function avanzarEstado(
    id: number, 
    data: { nuevo_estado_id: number; observacion?: string | null }
): Promise<void> {
    await apiClient.patch<PedidoRead>(`${PEDIDOS}/${id}/estado`, data)
}

export async function getHistorialPedido(pedidoId: number): Promise<HistorialEstadoPedido[]> {
    const response = await apiClient.get<HistorialEstadoPedido[]>(`${PEDIDOS}/${pedidoId}/historial`)
    return response.data
}

export async function cancelarPedido(id: number): Promise<PedidoRead> {
    const response = await apiClient.delete<PedidoRead>(`${PEDIDOS}/${id}`)
    return response.data
}

export async function getEstadosPosibles(id: number): Promise<EstadoPedido[]> {
    const response = await apiClient.get<EstadoPedido[]>(`${PEDIDOS}/${id}/estados-posibles`)
    return response.data
}
