import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket, type WsMessage } from "./useWebSocket";
import { useWsStore } from "@/stores/wsStore";

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

        const  tipo = (msg as unknown as { type?: string }).type

        if (tipo === 'pedido_estado_update' || tipo === 'pedido_nuevo') {
            const data = msg as unknown as {
                type: string
                pedido_id: number
                estado_codigo?: string
                usuario_id?: number
                total?: number
            }

            if (!data.pedido_id) return

            // Invalidar la query de listados → la tabla se actualiza sola
            queryClient.invalidateQueries({ queryKey: ['pedidos'] })

            // Invalidar la query de detalle → si la página de detalle está abierta
            queryClient.invalidateQueries({ queryKey: ['pedido', data.pedido_id] })

            // Invalidar historial del pedido → el timeline se actualiza
            queryClient.invalidateQueries({ queryKey: ['pedido-historial', data.pedido_id] })

            // Guardar resumen del evento en el wsStore para el badge
            setLastEvent({
                event: tipo,
                pedido_id: data.pedido_id,
                timestamp: new Date().toISOString(),
            })
        }
    }, [queryClient, setLastEvent])

    // ─── Conectar al WebSocket ──────────────────────────────────────────────
    const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
        onMessage: handleMessage,
        enabled: true,
    })

    return { subscribeToOrder, unsubscribeFromOrder }
}