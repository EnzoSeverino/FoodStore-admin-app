// ─── Catálogo de Estados
export type CodigoEstado =
    | 'PENDIENTE'
    | 'CONFIRMADO'
    | 'EN_PREP'
    | 'ENTREGADO'
    | 'CANCELADO'

export interface EstadoPedido {
    codigo: CodigoEstado
    descripcion: string
    order: number
    es_terminal: boolean
}

// ─── Forma de Pago
export interface FormaPago {
    codigo: string
    nombre: string
}

// ─── Detalle del Pedido (Snapshot Pattern) 
export interface DetallePedidoRead {
    producto_id: number
    nombre_snapshot: string
    precio_snapshot: number
    cantidad: number
    subtotal_snap: number
    personalizacion: number[] | null
}

// ─── Historial de Estados
export interface HistorialEstadoPedido {
    id: number
    estado_desde: CodigoEstado | null
    estado_hacia: CodigoEstado
    usuario_id: number | null
    motivo: string | null
    created_at: string
}

// ─── Pago (MercadoPago) 
export interface Pago {
    id: number
    pedido_id: number
    mp_payment_id: number | null
    mp_status: string
    mp_status_detail: string | null
    transaction_amount: number
    payment_method_id: string | null
    external_reference: string
    created_at: string
}

// ─── Pedido Read (listado compacto)
export interface PedidoRead {
    id: number
    usuario_id: number
    estado_codigo: CodigoEstado
    subtotal: number
    descuento: number
    costo_envio: number
    total: number
    forma_pago_codigo: string
    direccion_id: number | null
    notas: string | null
    created_at: string
}

// ─── Pedido Detail (vista completa)
export interface PedidoDetail extends PedidoRead {
    items: DetallePedidoRead[]
    historial: HistorialEstadoPedido[]
    pago: Pago | null
}

// ─── Requests

// Item individual dentro de un pedido
export interface ItemPedidoRequest {
    producto_id: number
    cantidad: number
    personalizacion?: number[] | null
}

// Body para POST /api/v1/pedidos
export interface CrearPedidoRequest {
    items: ItemPedidoRequest[]
    forma_pago_codigo: string
    direccion_id?: number | null
    notas?: string | null
}

// Body para PATCH /api/v1/pedidos/{id}/estado
export interface AvanzarEstadoRequest {
    nuevo_estado: CodigoEstado
    motivo?: string | null
}

// ─── WebSocket Events
export type WsEventType =
    | 'estado_cambiado'
    | 'pedido_cancelado'
    | 'pago_confirmado'

export interface WsEvento {
    event: WsEventType
    pedido_id: number
    estado_anterior: CodigoEstado | null
    estado_nuevo: CodigoEstado
    usuario_id: number | null
    motivo: string | null
    timestamp: string
}