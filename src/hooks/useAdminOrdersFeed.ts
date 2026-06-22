import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket, type WsMessage } from "./useWebSocket";
import { useWsStore } from "@/stores/wsStore";

interface PedidoWsEvent {
    type: 'pedido_estado_update' | 'pedido_nuevo'
    pedido_id: number
    estado_codigo?: string
    usuario_id?: number
    total?: number
}

function isPedidoWsEvent(msg: unknown): msg is PedidoWsEvent {
    const tipo = (msg as { type?: string })?.type
    return tipo === 'pedido_estado_update' || tipo === 'pedido_nuevo'
}

export function useAdminOrdersFeed() {
    const queryClient = useQueryClient()
    const setLastEvent = useWsStore((s) => s.setLastEvent)

    const handleMessage = useCallback((msg: WsMessage) => {
        if (msg.event === 'WS_CONNECTED') {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] })
            return
        }

        if (!isPedidoWsEvent(msg)) return

        queryClient.invalidateQueries({ queryKey: ['pedidos'] })
        queryClient.invalidateQueries({ queryKey: ['pedido', msg.pedido_id] })
        queryClient.invalidateQueries({ queryKey: ['pedido-historial', msg.pedido_id] })

        setLastEvent({
            event: msg.type,
            pedido_id: msg.pedido_id,
            timestamp: new Date().toISOString(),
        })
    }, [queryClient, setLastEvent])

    const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
        onMessage: handleMessage,
        enabled: true,
    })

    return { subscribeToOrder, unsubscribeFromOrder }
}