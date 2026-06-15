import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    getPedidos,
    getPedidoById,
    avanzarEstado,
    getHistorialPedido,
    cancelarPedido,
    getEstadosPosibles,
} from "@/api/pedidosApi";
import type { PedidoRead, PedidoDetail, HistorialEstadoPedido, EstadoPedido, AvanzarEstadoRequest } from "@/types/pedido";
import type { PaginatedResponse } from "@/types/api";

const PEDIDOS_KEY = ['pedidos']

export function usePedidos(params?: {
    page?: number,
    size?: number,
    estado_codigo?: string
}) {
    return useQuery<PaginatedResponse<PedidoRead>>({
        queryKey: [...PEDIDOS_KEY, params],
        queryFn: () => getPedidos(params),
        staleTime: 1 * 60 * 1000,
    })
}

export function usePedidoById(id: number | null) {
    return useQuery<PedidoDetail>({
        queryKey: ['pedido', id],
        queryFn: () => getPedidoById(id!),
        enabled: id !== null,
        staleTime: 1 * 60 * 1000,
    })
}

export function useHistorialPedido(pedidoId: number | null) {
    return useQuery<HistorialEstadoPedido[]>({
        queryKey: ['pedido-historial', pedidoId],
        queryFn: () => getHistorialPedido(pedidoId!),
        enabled: pedidoId !== null,
        staleTime: 1 * 60 * 1000,
    })
}

export function useEstadosPosibles(pedidoId: number | null) {
    return useQuery<EstadoPedido[]>({
        queryKey: ['pedido-estados-posibles', pedidoId],
        queryFn: () => getEstadosPosibles(pedidoId!),
        enabled: pedidoId !== null,
        staleTime: 30 * 1000,
    })
}

export function useAvanzarEstado() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({  id, data }: { id: number; data: AvanzarEstadoRequest }) => avanzarEstado(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PEDIDOS_KEY })
            queryClient.invalidateQueries({ queryKey: ['pedido', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['pedido-historial', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['pedido-estados-posibles', variables.id] })
        },
    })
}

export function useCancelarPedido() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => cancelarPedido(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: PEDIDOS_KEY })
            queryClient.invalidateQueries({ queryKey: ['pedido', id] })
            queryClient.invalidateQueries({ queryKey: ['pedido-historial', id] })
        },
    })
}