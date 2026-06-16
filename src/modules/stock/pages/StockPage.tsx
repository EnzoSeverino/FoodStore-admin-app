import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  useStockProductos,
  useUpdateStockDisponibilidad,
} from "../hooks/useStock";
import { StockTable } from "../components/StockTable";
import { SkeletonTable } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

export function StockPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roles.includes("ADMIN") ?? false;
  const isStock = user?.roles.includes("STOCK") ?? false;
  const toast = useToast();

  // ─── Paginación ─────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ─── Filtros ────────────────────────────────────────────────────────────
  const [filtroDisponible, setFiltroDisponible] = useState<boolean | undefined>(
    undefined,
  );
  const [busqueda, setBusqueda] = useState("");

  // ─── Queries ────────────────────────────────────────────────────────────
  const {
    data: stockData,
    isLoading,
    isError,
  } = useStockProductos({
    page,
    size: pageSize,
    disponible: filtroDisponible,
    search: busqueda || undefined,
  });

  // ─── Mutations ──────────────────────────────────────────────────────────
  const updateDisponibilidadMutation = useUpdateStockDisponibilidad();

  // ─── Handler de toggle disponibilidad ───────────────────────────────────
  const handleToggleDisponibilidad = async (
    id: number,
    disponible: boolean,
  ) => {
    try {
      await updateDisponibilidadMutation.mutateAsync({ id, disponible });
      toast.success(
        disponible
          ? "Producto habilitado correctamente"
          : "Producto deshabilitado correctamente",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cambiar disponibilidad",
      );
    }
  };

  // ─── Reset de página al cambiar filtros ─────────────────────────────────
  const handleFiltroDisponible = (value: boolean | undefined) => {
    setFiltroDisponible(value);
    setPage(1);
  };

  const handleBusqueda = (value: string) => {
    setBusqueda(value);
    setPage(1);
  };

  // ─── Sin permisos ───────────────────────────────────────────────────────
  if (!isAdmin && !isStock) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Stock
          </h1>
          <p className="text-sm text-slate-500">
            Control de disponibilidad de productos
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

  // ─── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Stock
          </h1>
          <p className="text-sm text-slate-500">
            Control de disponibilidad de productos
          </p>
        </div>
        <SkeletonTable rows={5} columns={6} />
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Stock
          </h1>
          <p className="text-sm text-slate-500">
            Control de disponibilidad de productos
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">Error al cargar los productos</p>
        </div>
      </div>
    );
  }

  const productos = stockData?.items ?? [];
  const totalPages = stockData?.pages ?? 1;
  const totalItems = stockData?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Stock</h1>
        <p className="text-sm text-slate-500">
          Control de disponibilidad de productos
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => handleBusqueda(e.target.value)}
            placeholder="Nombre o descripción..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </div>

        {/* Filtro por disponibilidad */}
        <div className="min-w-[150px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Disponibilidad
          </label>
          <select
            value={
              filtroDisponible === undefined
                ? ""
                : filtroDisponible
                  ? "true"
                  : "false"
            }
            onChange={(e) => {
              const value = e.target.value;
              handleFiltroDisponible(
                value === "" ? undefined : value === "true",
              );
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          >
            <option value="">Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </select>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-end">
          <p className="text-sm text-slate-500">
            {totalItems} {totalItems === 1 ? "producto" : "productos"}{" "}
            encontrados
          </p>
        </div>
      </div>

      {/* Tabla o EmptyState */}
      {productos.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No hay productos"
          description={
            busqueda || filtroDisponible !== undefined
              ? "No hay productos con los filtros seleccionados. Probá cambiando los filtros."
              : "Aún no se han registrado productos en el catálogo."
          }
        />
      ) : (
        <>
          <StockTable
            data={productos}
            onToggleDisponibilidad={handleToggleDisponibilidad}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Página {page} de {totalPages} — {totalItems} productos en total
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
    </div>
  );
}
