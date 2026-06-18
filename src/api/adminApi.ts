import apiClient from "./axiosInstance";

// ─── Tipos del endpoint /admin/dashboard
export interface DashboardBackend {
  total_productos: number
  total_categorias: number
  total_ingredientes: number
  total_pedidos: number
  pedidos_hoy: number
  ingresos_totales: number
  pedidos_por_estado: { codigo: string; nombre: string; cantidad: number }[]
  pedidos_recientes: { id: number; total: number; fecha: string; estado_codigo: string }[]
}

// ─── Tipos del endpoint /estadisticas
export interface DashboardTotals {
  total_productos: number
  total_categorias: number
  total_ingredientes: number
  total_pedidos: number
  total_usuarios: number
}

export interface PedidosPorEstado {
  estado: string   
  cantidad: number
}

export interface VentasPorPeriodo {
  fecha: string
  total_ventas: number      
  cantidad_pedidos: number  
}

export interface ProductoTop {
  producto_id: number
  nombre: string
  cantidad_total: number  
  monto_total: number     
}

export async function getDashboardTotals(): Promise<DashboardTotals> {
    // /admin/dashboard no tiene total_usuarios — usar /estadisticas/resumen
    const response = await apiClient.get<{
        total_productos: number
        total_categorias: number
        total_ingredientes: number
        total_pedidos: number
        total_usuarios: number
    }>('/estadisticas/resumen')

    return {
        total_productos: response.data.total_productos,
        total_categorias: response.data.total_categorias,
        total_ingredientes: response.data.total_ingredientes,
        total_pedidos: response.data.total_pedidos,
        total_usuarios: response.data.total_usuarios,
    }
}

// ─── GET /api/v1/estadisticas/pedidos-por-estado
export async function getPedidosPorEstado(): Promise<PedidosPorEstado[]> {
  const response = await apiClient.get<{ codigo: string; nombre: string; cantidad: number }[]>(
    '/estadisticas/pedidos-por-estado'
  )
  return response.data.map(item => ({
    estado: item.codigo,
    cantidad: item.cantidad,
  }))
}

// ─── GET /api/v1/estadisticas/ventas
export async function getVentasPorPeriodo(dias = 30): Promise<VentasPorPeriodo[]> {
  const hasta = new Date()
  const desde = new Date()
  desde.setDate(desde.getDate() - dias)

  const fmt = (d: Date) => d.toISOString().split('T')[0]

  const response = await apiClient.get<{ fecha: string; cantidad_pedidos: number; ingresos: number }[]>(
    '/estadisticas/ventas',
    { params: { fecha_desde: fmt(desde), fecha_hasta: fmt(hasta), agrupar_por: 'dia' } }
  )
  return response.data.map(item => ({
    fecha: item.fecha,
    total_ventas: item.ingresos,
    cantidad_pedidos: item.cantidad_pedidos,
  }))
}

// ─── GET /api/v1/estadisticas/productos-mas-vendidos
export async function getProductosTop(limit = 10): Promise<ProductoTop[]> {
  const response = await apiClient.get<{ producto_id: number; nombre: string; total_vendido: number; total_ingresos: number }[]>(
    '/estadisticas/productos-mas-vendidos',
    { params: { limite: limit } }
  )
  return response.data.map(item => ({
    producto_id: item.producto_id,
    nombre: item.nombre,
    cantidad_total: item.total_vendido,
    monto_total: item.total_ingresos,
  }))
}