import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePedidos } from "../hooks/usePedidos";
import { PedidosTable } from "../components/PedidosTable";
import { CancelarModal } from "../components/CancelarModal";
import { SkeletonTable } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PedidoRead, CodigoEstado } from "@/types/pedido";

const estadoOptions: { value: CodigoEstado | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "EN_PREP", label: "En Preparación" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "CANCELADO", label: "Cancelado" },
];

export function PedidosPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roles.includes("ADMIN") ?? false;
  const isPedidos = user?.roles.includes("PEDIDOS") ?? false;

  // ─── Paginación ─────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ─── Filtros ────────────────────────────────────────────────────────────
  const [filtroEstado, setFiltroEstado] = useState<CodigoEstado | undefined>(
    undefined,
  );

  // ─── Queries ────────────────────────────────────────────────────────────
  const {
    data: pedidosData,
    isLoading,
    isError,
  } = usePedidos({
    page,
    size: pageSize,
    estado_codigo: filtroEstado,
  });

  // ─── Estado del modal de cancelación ────────────────────────────────────
  const [pedidoACancelar, setPedidoACancelar] = useState<PedidoRead | null>(
    null,
  );

  // ─── Handler de filtro ──────────────────────────────────────────────────
  const handleFiltroEstado = (value: string) => {
    setFiltroEstado(value === "" ? undefined : (value as CodigoEstado));
    setPage(1); // Reset a página 1 al cambiar filtro
  };

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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
          <p className="text-sm text-slate-500">
            Gestión y seguimiento de pedidos
          </p>
        </div>
        <SkeletonTable rows={5} columns={9} />
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
          <p className="text-sm text-slate-500">
            Gestión y seguimiento de pedidos
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">Error al cargar los pedidos</p>
        </div>
      </div>
    );
  }

  // ─── Sin permisos ───────────────────────────────────────────────────────
  if (!isAdmin && !isPedidos) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
          <p className="text-sm text-slate-500">
            Gestión y seguimiento de pedidos
          </p>
        </div>
        <EmptyState
          icon="🔒"
          title="Sin permisos"
          description="No tenés permisos para ver esta sección. Contactá a un administrador."
        />
      </div>
    );
  }

  const pedidos = pedidosData?.items ?? [];
  const totalPages = pedidosData?.pages ?? 1;
  const totalItems = pedidosData?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p className="text-sm text-slate-500">
          Gestión y seguimiento de pedidos
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4">
        {/* Filtro por estado */}
        <div className="min-w-[200px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Estado
          </label>
          <select
            value={filtroEstado ?? ""}
            onChange={(e) => handleFiltroEstado(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          >
            {estadoOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-end">
          <p className="text-sm text-slate-500">
            {totalItems} {totalItems === 1 ? "pedido" : "pedidos"} encontrados
          </p>
        </div>
      </div>

      {/* Tabla o EmptyState */}
      {pedidos.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No hay pedidos"
          description={
            filtroEstado
              ? "No hay pedidos con el estado seleccionado. Probá cambiando el filtro."
              : "Aún no se han registrado pedidos en el sistema."
          }
        />
      ) : (
        <>
          <PedidosTable data={pedidos} onCancelarClick={handleCancelarClick} />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Página {page} de {totalPages} — {totalItems} pedidos en total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de cancelación */}
      <CancelarModal
        pedido={pedidoACancelar}
        isOpen={pedidoACancelar !== null}
        onClose={handleCancelarClose}
      />
    </div>
  );
}
