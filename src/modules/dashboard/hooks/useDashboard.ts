import { useQuery } from "@tanstack/react-query";
import { 
    getDashboardTotals,
    getPedidosPorEstado,
    getVentasPorPeriodo,
    getProductosTop,
} from "@/api/adminApi";


export function useDashboardTotals() {
    return useQuery({
        queryKey: ['dashboard', 'totals'],
        queryFn: getDashboardTotals,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}

export function usePedidosPorEstado() {
    return useQuery({
        queryKey: ['dashboard', 'pedidos-por-estado'],
        queryFn: getPedidosPorEstado,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}

export function useVentasPorPeriodo(dias = 30) {
    return useQuery({
        queryKey: ['dashboard', 'ventas', dias],
        queryFn: () => getVentasPorPeriodo(dias),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}

export function useProductosTop(limit = 10) {
    return useQuery({
        queryKey: ['dashboard', 'productos-top', limit],
        queryFn: () => getProductosTop(limit),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}
