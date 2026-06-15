import { useState } from "react";
import { useEstadosPosibles, useAvanzarEstado } from "../hooks/usePedidos";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import type { CodigoEstado, PedidoRead } from "@/types/pedido";

interface EstadoActionsProps {
  pedido: PedidoRead;
  onCancelarClick: (pedido: PedidoRead) => void;
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
  CONFIRMADO: "Confirmar",
  EN_PREP: "En Preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelar",
};

// ─── Colores de botones según estado destino ────────────────────────────────
const botonStyles: Record<CodigoEstado, string> = {
  PENDIENTE:
    "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100",
  CONFIRMADO: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  EN_PREP: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
  ENTREGADO: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
  CANCELADO: "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
};

export function EstadoActions({ pedido, onCancelarClick }: EstadoActionsProps) {
  const toast = useToast();
  const [avanzando, setAvanzando] = useState(false);

  const { data: estadosPosibles = [], isLoading } = useEstadosPosibles(
    pedido.id,
  );
  const avanzarMutation = useAvanzarEstado();

  // ─── Si el estado actual es terminal, no hay acciones disponibles ─────────
  const esTerminal =
    pedido.estado_codigo === "ENTREGADO" ||
    pedido.estado_codigo === "CANCELADO";

  if (esTerminal) {
    return (
      <Badge variant={estadoVariant[pedido.estado_codigo]}>
        {estadoLabels[pedido.estado_codigo]}
      </Badge>
    );
  }

  // ─── Handler para avanzar estado ──────────────────────────────────────────
  const handleAvanzar = async (nuevoEstado: CodigoEstado) => {
    // Si es cancelación, delegar al modal (necesita motivo)
    if (nuevoEstado === "CANCELADO") {
      onCancelarClick(pedido);
      return;
    }

    setAvanzando(true);
    try {
      await avanzarMutation.mutateAsync({
        id: pedido.id,
        data: { nuevo_estado: nuevoEstado },
      });
      toast.success(
        `Pedido #${pedido.id} avanzado a ${estadoLabels[nuevoEstado]}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al avanzar estado",
      );
    } finally {
      setAvanzando(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Badge del estado actual */}
      <Badge variant={estadoVariant[pedido.estado_codigo]}>
        {estadoLabels[pedido.estado_codigo]}
      </Badge>

      {/* Botones de transición */}
      {isLoading ? (
        <span className="text-xs text-slate-400">...</span>
      ) : (
        estadosPosibles.map((estado) => (
          <button
            key={estado.codigo}
            onClick={() => handleAvanzar(estado.codigo)}
            disabled={avanzando || avanzarMutation.isPending}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${botonStyles[estado.codigo]}`}
          >
            {estado.codigo === "CANCELADO"
              ? "Cancelar"
              : `→ ${estadoLabels[estado.codigo]}`}
          </button>
        ))
      )}
    </div>
  );
}
