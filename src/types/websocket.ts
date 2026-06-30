export type WsConnectionStatus =
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error'

export interface WsState {
    status: WsConnectionStatus
    lastEvent: WsLastEvent | null
    retryCount: number
}

export interface WsLastEvent {
    event: string
    pedido_id: number
    timestamp: string
}
