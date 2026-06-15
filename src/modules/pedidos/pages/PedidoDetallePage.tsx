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

  // ─── Queries ────────────────────────────────────────────────────────────
  const { data: pedido, isLoading, isError } = usePedidoById(pedidoId);
  const { data: historial = [] } = useHistorialPedido(pedidoId);

  // ─── Handler de cancelación ─────────────────────────────────────────────
  const handleCancelarClick = (pedido: PedidoRead) => {
    setPedidoACancelar(pedido);
  };

  const handleCancelarClose = () => {
    setPedidoACancelar(null);
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
              {new Date(pedido.created_at).toLocaleString("es-AR")}
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
                <Badge variant={estadoVariant[pedido.estado_codigo]}>
                  {estadoLabels[pedido.estado_codigo]}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Forma de pago:</span>
                <span className="font-medium text-slate-900">
                  {pedido.forma_pago_codigo}
                </span>
              </div>
              {pedido.notas && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-600 mb-1">
                    Notas:
                  </p>
                  <p className="text-sm text-slate-700">{pedido.notas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items del pedido */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Items del Pedido
            </h2>
            {pedido.items.length === 0 ? (
              <p className="text-sm text-slate-400">
                No hay items en este pedido
              </p>
            ) : (
              <div className="space-y-3">
                {pedido.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {item.nombre_snapshot}
                      </p>
                      <p className="text-xs text-slate-500">
                        ${item.precio_snapshot.toFixed(2)} × {item.cantidad}
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

          {/* Información de pago (si existe) */}
          {pedido.pago && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Información de Pago
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Estado:</span>
                  <Badge
                    variant={
                      pedido.pago.mp_status === "approved"
                        ? "success"
                        : pedido.pago.mp_status === "rejected"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {pedido.pago.mp_status}
                  </Badge>
                </div>
                {pedido.pago.mp_payment_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">ID MercadoPago:</span>
                    <span className="font-mono text-xs text-slate-900">
                      {pedido.pago.mp_payment_id}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Monto:</span>
                  <span className="font-medium text-slate-900">
                    ${pedido.pago.transaction_amount.toFixed(2)}
                  </span>
                </div>
                {pedido.pago.payment_method_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Método:</span>
                    <span className="text-slate-900">
                      {pedido.pago.payment_method_id}
                    </span>
                  </div>
                )}
                {pedido.pago.mp_status_detail && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      Detalle:
                    </p>
                    <p className="text-sm text-slate-700">
                      {pedido.pago.mp_status_detail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de cancelación */}
      <CancelarModal
        pedido={pedidoACancelar}
        isOpen={pedidoACancelar !== null}
        onClose={handleCancelarClose}
      />
    </div>
  );
}
