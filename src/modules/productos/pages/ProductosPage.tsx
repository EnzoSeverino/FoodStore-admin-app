import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  useProductos,
  useCreateProducto,
  useUpdateProducto,
  useDeleteProducto,
  useUpdateDisponibilidad,
} from "../hooks/useProductos";
import { useAllCategorias } from "@/modules/categorias/hooks/useCategorias";
import { ProductosTable } from "../components/ProductosTable";
import { ProductoModal } from "../components/ProductoModal";
import { SkeletonTable } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { hasRole } from "@/lib/roles";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
} from "@/types/producto";

export function ProductosPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = hasRole(user, "ADMIN");
  const isStock = hasRole(user, "STOCK");
  const toast = useToast();

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [filtroCategoria, setFiltroCategoria] = useState<number | undefined>(
    undefined,
  );
  const [filtroDisponible, setFiltroDisponible] = useState<boolean | undefined>(
    undefined,
  );
  const [busqueda, setBusqueda] = useState("");
  const busquedaDebounced = useDebounce(busqueda, 400);

  const {
    data: productosData,
    isLoading,
    isError,
  } = useProductos({
    page,
    size: pageSize,
    categoria: filtroCategoria,
    disponible: filtroDisponible,
    search: busquedaDebounced || undefined,
  });
  const { data: categorias = [] } = useAllCategorias();

  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();
  const deleteMutation = useDeleteProducto();
  const updateDisponibilidadMutation = useUpdateDisponibilidad();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEditing, setProductoEditing] = useState<Producto | null>(null);

  const [productoToDelete, setProductoToDelete] = useState<number | null>(null);

  const handleOpenCreate = () => {
    setProductoEditing(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (producto: Producto) => {
    setProductoEditing(producto);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setProductoEditing(null);
  };

  const handleSubmit = async (data: ProductoCreate | ProductoUpdate) => {
    try {
      if (productoEditing) {
        await updateMutation.mutateAsync({ id: productoEditing.id, data });
        toast.success("Producto actualizado correctamente");
      } else {
        await createMutation.mutateAsync(data as ProductoCreate);
        toast.success("Producto creado correctamente");
      }
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el producto",
      );
    }
  };

  const handleDeleteRequest = (id: number) => {
    setProductoToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (productoToDelete === null) return;
    try {
      await deleteMutation.mutateAsync(productoToDelete);
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar el producto",
      );
    } finally {
      setProductoToDelete(null);
    }
  };

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

  const handleFiltroCategoria = (value: number | undefined) => {
    setFiltroCategoria(value);
    setPage(1);
  };

  const handleFiltroDisponible = (value: boolean | undefined) => {
    setFiltroDisponible(value);
    setPage(1);
  };

  const handleBusqueda = (value: string) => {
    setBusqueda(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500">
            Gestión de productos del catálogo
          </p>
        </div>
        <SkeletonTable rows={5} columns={10} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500">
            Gestión de productos del catálogo
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">Error al cargar los productos</p>
        </div>
      </div>
    );
  }

  const productos = productosData?.items ?? [];
  const totalPages = productosData?.pages ?? 1;
  const totalItems = productosData?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500">
            Gestión de productos del catálogo
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            <span>+</span> Nuevo Producto
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4">
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

        <div className="min-w-[150px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Categoría
          </label>
          <select
            value={filtroCategoria ?? ""}
            onChange={(e) =>
              handleFiltroCategoria(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

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
      </div>

      {productos.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No hay productos"
          description="Agregá tu primer producto al catálogo."
          actionLabel={isAdmin ? "Nuevo Producto" : undefined}
          onAction={isAdmin ? handleOpenCreate : undefined}
        />
      ) : (
        <>
          <ProductosTable
            data={productos}
            isAdmin={isAdmin}
            isStock={isStock}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteRequest}
            onToggleDisponibilidad={handleToggleDisponibilidad}
          />

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

      <ProductoModal
        key={productoEditing?.id ?? "new"}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        productoEditing={productoEditing}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={productoToDelete !== null}
        onClose={() => setProductoToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
