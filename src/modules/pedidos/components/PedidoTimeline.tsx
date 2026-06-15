import { Badge } from "@/components/ui/Badge";
import type { HistorialEstadoPedido, CodigoEstado } from "@/types/pedido";

interface PedidoTimelineProps {
  historial: HistorialEstadoPedido[];
}

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

// ─── Labels legibles para cada estado ───────────────────────────────────────
const estadoLabels: Record<CodigoEstado, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREP: "En Preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

// ─── Colores de la línea vertical según estado ──────────────────────────────
const lineaColors: Record<CodigoEstado, string> = {
  PENDIENTE: "bg-yellow-300",
  CONFIRMADO: "bg-blue-300",
  EN_PREP: "bg-amber-300",
  ENTREGADO: "bg-green-300",
  CANCELADO: "bg-red-300",
};

// ─── Colores del punto según estado ─────────────────────────────────────────
const puntoColors: Record<CodigoEstado, string> = {
  PENDIENTE: "bg-yellow-500 ring-yellow-200",
  CONFIRMADO: "bg-blue-500 ring-blue-200",
  EN_PREP: "bg-amber-500 ring-amber-200",
  ENTREGADO: "bg-green-500 ring-green-200",
  CANCELADO: "bg-red-500 ring-red-200",
};

export function PedidoTimeline({ historial }: PedidoTimelineProps) {
  if (historial.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-400">No hay historial disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {historial.map((entry, index) => {
        const esPrimero = index === 0;
        const esUltimo = index === historial.length - 1;
        const esCancelacion = entry.estado_hacia === "CANCELADO";

        return (
          <div key={entry.id} className="relative flex gap-4">
            {/* Columna izquierda: línea vertical + punto */}
            <div className="flex flex-col items-center">
              {/* Punto */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ${puntoColors[entry.estado_hacia]}`}
              >
                <span className="text-xs font-bold text-white">
                  {entry.estado_hacia.charAt(0)}
                </span>
              </div>

              {/* Línea vertical (excepto en el último) */}
              {!esUltimo && (
                <div
                  className={`w-0.5 flex-1 ${lineaColors[entry.estado_hacia]}`}
                />
              )}
            </div>

            {/* Columna derecha: contenido */}
            <div className={`flex-1 pb-8 ${esUltimo ? "pb-0" : ""}`}>
              {/* Header: transición de estado */}
              <div className="flex items-center gap-2 flex-wrap">
                {esPrimero ? (
                  <span className="text-xs text-slate-400">Creación</span>
                ) : (
                  <Badge variant={estadoVariant[entry.estado_desde!]}>
                    {estadoLabels[entry.estado_desde!]}
                  </Badge>
                )}

                <span className="text-slate-400">→</span>

                <Badge variant={estadoVariant[entry.estado_hacia]}>
                  {estadoLabels[entry.estado_hacia]}
                </Badge>
              </div>

              {/* Timestamp */}
              <p className="mt-1 text-xs text-slate-500">
                {new Date(entry.created_at).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {entry.usuario_id && (
                  <span className="ml-2 text-slate-400">
                    · Usuario #{entry.usuario_id}
                  </span>
                )}
                {!entry.usuario_id && (
                  <span className="ml-2 text-slate-400">· Sistema</span>
                )}
              </p>

              {/* Motivo (solo en cancelaciones) */}
              {esCancelacion && entry.motivo && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-xs font-medium text-red-700 mb-0.5">
                    Motivo:
                  </p>
                  <p className="text-sm text-red-800">{entry.motivo}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
