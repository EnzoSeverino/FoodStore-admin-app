import { useState } from "react";
import { useAvanzarEstado } from "../hooks/usePedidos";
import { useToast } from "@/components/ui/Toast";
import type { PedidoRead } from "@/types/pedido";

interface CancelarModalProps {
  pedido: PedidoRead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelarModal({ pedido, isOpen, onClose }: CancelarModalProps) {
  const toast = useToast();
  const [motivo, setMotivo] = useState("");
  const avanzarMutation = useAvanzarEstado();

  // ─── Handler de submit ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pedido) return;

    if (!motivo.trim()) {
      toast.error("El motivo de cancelación es obligatorio");
      return;
    }

    try {
      await avanzarMutation.mutateAsync({
        id: pedido.id,
        data: {
          nuevo_estado: "CANCELADO",
          motivo: motivo.trim(),
        },
      });
      toast.success(`Pedido #${pedido.id} cancelado correctamente`);
      setMotivo("");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al cancelar el pedido",
      );
    }
  };

  // ─── Handler de cierre ────────────────────────────────────────────────────
  const handleClose = () => {
    setMotivo("");
    onClose();
  };

  if (!isOpen || !pedido) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Cancelar Pedido #{pedido.id}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información del pedido */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total:</span>
              <span className="font-medium text-slate-900">
                ${pedido.total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-600">Estado actual:</span>
              <span className="font-medium text-slate-900">
                {pedido.estado_codigo}
              </span>
            </div>
          </div>

          {/* Campo: Motivo (obligatorio) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Motivo de cancelación <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              disabled={avanzarMutation.isPending}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
              placeholder="Ingrese el motivo de la cancelación..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Este motivo se registrará en el historial del pedido (obligatorio)
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={avanzarMutation.isPending}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={avanzarMutation.isPending || !motivo.trim()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {avanzarMutation.isPending
                ? "Cancelando..."
                : "Confirmar Cancelación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
