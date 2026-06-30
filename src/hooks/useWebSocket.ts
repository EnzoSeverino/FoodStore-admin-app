import { useEffect, useRef, useCallback } from 'react'
import { useWsStore } from '@/stores/wsStore'
import { useAuthStore } from '@/stores/authStore'

// ─── URL base del WebSocket 
function getWsUrl(): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string
    const wsBase = baseUrl
    .replace(/^http:/, 'ws:')
    .replace(/^https:/, 'wss:')
    return `${wsBase}/ws/pedidos`
}

// ─── Tipo del mensaje que llega del servidor
export interface WsMessage {
    event: string
    data: unknown
}

interface UseWebSocketOptions {
    onMessage?: (msg: WsMessage) => void
    enabled?: boolean
}

// ─── Hook useWebSocket 
export function useWebSocket({
    onMessage,
    enabled = true,
}: UseWebSocketOptions = {}) {

    const wsRef = useRef<WebSocket | null>(null)
    const onMessageRef = useRef(onMessage)

    useEffect(() => {
        onMessageRef.current = onMessage
    }, [onMessage])

    // Acciones del wsStore — se leen fuera del efecto para no crear dependencia
    const setStatus = useWsStore((s) => s.setStatus)
    const incrementRetry = useWsStore((s) => s.incrementRetry)
    const resetRetry = useWsStore((s) => s.resetRetry)
    const reset = useWsStore((s) => s.reset)
    const accessToken = useAuthStore((s) => s.accessToken)

    useEffect(() => {
        if (!enabled) return

        const token = accessToken
        if (!token) { setStatus('disconnected'); return }

        let cancelled = false
        let retryCount = 0
        let retryTimer: ReturnType<typeof setTimeout> | null = null
        let currentWs: WebSocket | null = null

        // ─── closeCleanly 
        const closeCleanly = (ws: WebSocket) => {
            if (ws.readyState === WebSocket.CONNECTING) {
                ws.addEventListener('open', () => ws.close(1000), { once: true })
            } else if (ws.readyState === WebSocket.OPEN) {
                ws.close(1000)
            }
        }

        // ─── connect 
        const connect = () => {
            if (cancelled) return

            const url = `${getWsUrl()}?token=${encodeURIComponent(token)}`

            const ws = new WebSocket(url)
            currentWs = ws
            wsRef.current = ws

            setStatus('connecting')

            ws.onopen = () => {
                if (cancelled) {
                    ws.close(1000)
                    return
                }
                retryCount = 0
                resetRetry()
                setStatus('connected')
                onMessageRef.current?.({ event: 'WS_CONNECTED', data: null })
            }

            ws.onmessage = (event) => {
                if (cancelled) return
                try {
                    const msg = JSON.parse(event.data as string) as WsMessage
                    onMessageRef.current?.(msg)
                } catch {
                    // Ignorar mensajes malformados
                }
            }

            ws.onerror = () => {
                setStatus('error')
            }

            ws.onclose = (e) => {
                if (wsRef.current === ws) wsRef.current = null
                currentWs = null

                const wasNormal = e.code === 1000
                const wasAuthRejected = e.code === 1008

                if (cancelled || wasNormal || wasAuthRejected) {
                    setStatus('disconnected')
                    return
                }

                setStatus('connecting')
                retryCount++
                incrementRetry()
                const delay = Math.min(1000 * 2 ** retryCount, 30_000)
                console.warn(
                    `[WS] Reconectando en ${delay / 1000}s (intento ${retryCount})`,
                )
                retryTimer = setTimeout(connect, delay)
            }
        }

        connect()

        // ─── Cleanup 
        return () => {
            cancelled = true
            if (retryTimer !== null) clearTimeout(retryTimer)
            if (currentWs) closeCleanly(currentWs)
            wsRef.current = null
            reset()
        }
    }, [enabled, accessToken, setStatus, incrementRetry, resetRetry, reset])

    // ─── subscribeToOrder ───────────────────────────────────────────────────
    const subscribeToOrder = useCallback((orderId: number) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({ action: 'subscribe-order', order_id: orderId }),
            )
        }
    }, [])

    // ─── unsubscribeFromOrder ───────────────────────────────────────────────
    const unsubscribeFromOrder = useCallback((orderId: number) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({ action: 'unsubscribe-order', order_id: orderId }),
            )
        }
    }, [])

    return { subscribeToOrder, unsubscribeFromOrder }
}