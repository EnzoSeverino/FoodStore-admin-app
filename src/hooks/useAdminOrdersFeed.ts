import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket, type WsMessage } from "./useWebSocket";
import { useWsStore } from "@/stores/wsStore";
import type { WsEvento } from "@/types/pedido";

export function useAdminOrdersFeed() {

    const queryClient = useQueryClient()
    const setLastEvent = useWsStore((s) => s.setLastEvent)

    // ─── onMessage
    const handleMessage = useCallback((msg: WsMessage) => {
        
        if (msg.event === 'WS_CONNECTED') {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] })
            return
        }

        // ── Eventos reales del backend ────────────────────────────────────

        // Parsear el payload como WsEvento (tipado en types/pedido.ts)
        const  evento = msg as unknown as WsEvento

        // Validar que tenga la estructura esperada
        if (!evento.event || !evento.pedido_id) return

        // Invalidar la query de listados → la tabla se actualiza sola
        queryClient.invalidateQueries({ queryKey: ['pedidos'] })

        // Invalidar la query de detalle → si la página de detalle está abierta
        queryClient.invalidateQueries({ queryKey: ['pedido', evento.pedido_id] })

        // Invalidar historial del pedido → el timeline se actualiza
        queryClient.invalidateQueries({ queryKey: ['pedido-historial', evento.pedido_id] })

        // Guardar resumen del evento en el wsStore para el badge
        setLastEvent({
            event: evento.event,
            pedido_id: evento.pedido_id,
            timestamp: evento.timestamp,
        })
    }, [queryClient, setLastEvent])

    // ─── Conectar al WebSocket ──────────────────────────────────────────────
    const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
        onMessage: handleMessage,
        enabled: true,
    })

    return { subscribeToOrder, unsubscribeFromOrder }
}