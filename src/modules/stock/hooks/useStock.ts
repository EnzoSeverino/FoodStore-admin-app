import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductos, updateDisponibilidad } from "@/api/productosApi";
import type { PaginatedResponse } from "@/types/api";
import type { Producto } from "@/types/producto";

const STOCK_KEY = ['stock'] as const

export function useStockProductos(params?: {
    page?: number
    size?: number
    disponible?: boolean
    search?: string
}) {
    return useQuery<PaginatedResponse<Producto>>({
        queryKey: [...STOCK_KEY, params],
        queryFn: () => getProductos(params),
        staleTime: 2 * 60 * 1000
    })
}

export function useUpdateStockDisponibilidad() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
            updateDisponibilidad(id, disponible),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STOCK_KEY })
            queryClient.invalidateQueries({ queryKey: ['productos'] })
        }
    })
}