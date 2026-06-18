import { useParams, useNavigate } from "react-router-dom";
import { usePedidoById, useHistorialPedido } from "../hooks/usePedidos";
import { PedidoTimeline } from "../components/PedidoTimeline";
import { EstadoActions } from "../components/EstadoActions";
import { CancelarModal } from "../components/CancelarModal";
import { Badge } from "@/components/ui/Badge";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState } from "react";
import type { PedidoRead, CodigoEstado } from "@/types/pedido";

// ─── Mapeo de estado → variante de Badge ────────────────────────────────────

const estadoVariant: Record<
  CodigoEstado,
  "warning" | "info" | "success" | "danger"
> = {
  PENDIENTE: "warning",
  CONFIRMADO: "info",
  EN_PREP: "warning",
  ENTREGADO: "success",
  CANCELADO: "danger",
};

const estadoLabels: Record<CodigoEstado, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREP: "En Preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export function PedidoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pedidoId = Number(id);

  const [pedidoACancelar, setPedidoACancelar] = useState<PedidoRead | null>(
    null,
  );
  const [canceladoEstadoId, setCanceladoEstadoId] = useState<number>(0);

  // ─── Queries ────────────────────────────────────────────────────────────
  const { data: pedido, isLoading, isError } = usePedidoById(pedidoId);
  const { data: historial = [] } = useHistorialPedido(pedidoId);

  // ─── Handler de cancelación ─────────────────────────────────────────────
  const handleCancelarClick = (pedido: PedidoRead, estadoId: number) => {
    setPedidoACancelar(pedido);
    setCanceladoEstadoId(estadoId);
  };

  const handleCancelarClose = () => {
    setPedidoACancelar(null);
    setCanceladoEstadoId(0);
  };

  // ─── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pedidos")}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Pedido #{pedidoId}
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <SkeletonLoader className="h-5 w-32 mb-4" />
            <SkeletonLoader className="h-4 w-full mb-2" />
            <SkeletonLoader className="h-4 w-full mb-2" />
            <SkeletonLoader className="h-4 w-3/4" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <SkeletonLoader className="h-5 w-32 mb-4" />
            <SkeletonLoader className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────
  if (isError || !pedido) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pedidos")}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Pedido #{pedidoId}
          </h1>
        </div>
        <EmptyState
          icon="❌"
          title="Error al cargar el pedido"
          description="No se pudo cargar la información del pedido. Verificá que el ID sea correcto."
          actionLabel="Volver a Pedidos"
          onAction={() => navigate("/pedidos")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón volver */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pedidos")}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Volver
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Pedido #{pedido.id}
            </h1>
            <p className="text-sm text-slate-500">
              {new Date(pedido.fecha_pedido).toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        {/* Acciones de estado */}
        <EstadoActions pedido={pedido} onCancelarClick={handleCancelarClick} />
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Columna izquierda: Detalles del pedido */}
        <div className="space-y-6">
          {/* Información general */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Información General
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Cliente:</span>
                <span className="font-medium text-slate-900">
                  Usuario #{pedido.usuario_id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Estado:</span>
                <Badge
                  variant={
                    estadoVariant[pedido.estado_actual?.codigo ?? "PENDIENTE"]
                  }
                >
                  {estadoLabels[pedido.estado_actual?.codigo ?? "PENDIENTE"]}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Forma de pago:</span>
                <span className="font-medium text-slate-900">
                  {pedido.forma_pago?.codigo ?? ""}
                </span>
              </div>
            </div>
          </div>

          {/* Items del pedido */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Items del Pedido
            </h2>
            {pedido.detalles.length === 0 ? (
              <p className="text-sm text-slate-400">
                No hay items en este pedido
              </p>
            ) : (
              <div className="space-y-3">
                {pedido.detalles.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {item.nombre_producto}
                      </p>
                      <p className="text-xs text-slate-500">
                        ${item.precio_unitario.toFixed(2)} × {item.cantidad}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      ${item.subtotal_snap.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desglose de totales */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Desglose
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="text-slate-900">
                  ${pedido.subtotal.toFixed(2)}
                </span>
              </div>
              {pedido.descuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Descuento:</span>
                  <span className="text-green-600">
                    -${pedido.descuento.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Costo de envío:</span>
                <span className="text-slate-900">
                  ${pedido.costo_envio.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-2 mt-2">
                <span className="text-slate-900">Total:</span>
                <span className="text-slate-900">
                  ${pedido.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Timeline e historial */}
        <div className="space-y-6">
          {/* Timeline de estados */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Historial de Estados
            </h2>
            <PedidoTimeline historial={historial} />
          </div>
        </div>
      </div>

      {/* Modal de cancelación */}
      <CancelarModal
        pedido={pedidoACancelar}
        isOpen={pedidoACancelar !== null}
        onClose={handleCancelarClose}
        canceladoEstadoId={canceladoEstadoId}
      />
    </div>
  );
}
