// ─── Catálogo de Estados
export type CodigoEstado =
    | 'PENDIENTE'
    | 'CONFIRMADO'
    | 'EN_PREP'
    | 'ENTREGADO'
    | 'CANCELADO'

export interface EstadoPedido {
    id: number
    codigo: CodigoEstado
    nombre: string
    orden: number
    es_terminal: boolean
}

// ─── Detalle del Pedido
export interface DetallePedidoRead {
    id: number
    producto_id: number
    nombre_producto: string
    precio_unitario: number
    cantidad: number
    subtotal: number
    subtotal_snap: number
    personalizacion: number[] | null
}

// ─── Historial de Estados (append-only, audit trail)
export interface HistorialEstadoPedido {
    id: number
    pedido_id: number
    estado_anterior_id: number | null
    estado_nuevo_id: number
    cambiado_por_id: number
    fecha_cambio: string
    observacion: string | null
    estado_anterior: { id: number; codigo: CodigoEstado; nombre: string; es_terminal: boolean } | null
    estado_nuevo: { id: number; codigo: CodigoEstado; nombre: string; es_terminal: boolean }
}

// ─── Pedido (listado)
export interface PedidoRead {
    id: number
    usuario_id: number
    fecha_pedido: string
    estado_actual_id: number
    forma_pago_id: number
    direccion_entrega_id: number | null
    subtotal: number
    descuento: number
    costo_envio: number
    total: number
    estado_actual: { id: number; codigo: CodigoEstado; nombre: string; orden: number; es_terminal: boolean } | null
    forma_pago: { id: number; nombre: string; codigo: string } | null
}

// ─── Pedido (detalle completo)
export interface PedidoDetail extends PedidoRead {
    detalles: DetallePedidoRead[]
    historial_estados: HistorialEstadoPedido[]
}

// ─── Body para PATCH /api/v1/pedidos/{id}/estado
export interface AvanzarEstadoRequest {
    nuevo_estado_id: number
    observacion?: string | null
}