import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  useCategorias,
  useCreateCategoria,
  useUpdateCategoria,
  useDeleteCategoria,
  useAllCategorias,
} from "../hooks/useCategorias";
import { CategoriasTable } from "../components/CategoriasTable";
import { CategoriaModal } from "../components/CategoriaModal";
import { SkeletonTable } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { hasRole } from "@/lib/roles";
import type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from "@/types/categoria";

export function CategoriasPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = hasRole(user, "ADMIN");
  const toast = useToast();

  // ─── Paginación ─────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ─── Queries ────────────────────────────────────────────────────────────
  const {
    data: categoriasData,
    isLoading,
    isError,
  } = useCategorias(page, pageSize);
  const { data: allCategorias = [] } = useAllCategorias();

  // ─── Mutations ──────────────────────────────────────────────────────────
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();
  const deleteMutation = useDeleteCategoria();

  // ─── Estado del modal ───────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaEditing, setCategoriaEditing] = useState<Categoria | null>(
    null,
  );

  // ─── Estado del diálogo de confirmación ─────────────────────────────────
  const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(
    null,
  );

  // ─── Handlers del modal ─────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setCategoriaEditing(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (categoria: Categoria) => {
    setCategoriaEditing(categoria);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCategoriaEditing(null);
  };

  // ─── Submit del formulario (crear o actualizar) ────────────────────────
  const handleSubmit = async (data: CategoriaCreate | CategoriaUpdate) => {
    try {
      if (categoriaEditing) {
        await updateMutation.mutateAsync({ id: categoriaEditing.id, data });
        toast.success("Categoría actualizada correctamente");
      } else {
        await createMutation.mutateAsync(data as CategoriaCreate);
        toast.success("Categoría creada correctamente");
      }
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al guardar la categoría",
      );
    }
  };

  // ─── Handlers de eliminación ────────────────────────────────────────────
  const handleDeleteRequest = async (id: number) => {
    setCategoriaToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (categoriaToDelete === null) return;
    try {
      await deleteMutation.mutateAsync(categoriaToDelete);
      toast.success("Categoria eliminada correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar la categoría",
      );
    } finally {
      setCategoriaToDelete(null);
    }
  };

  // ─── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
          <p className="text-sm text-slate-500">
            Gestión de categorías y subcategorías
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
          <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
          <p className="text-sm text-slate-500">
            Gestión de categorías y subcategorías
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">Error al cargar las categorías</p>
        </div>
      </div>
    );
  }

  const categorias = categoriasData?.items ?? [];
  const totalPages = categoriasData?.pages ?? 1;
  const totalItems = categoriasData?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
          <p className="text-sm text-slate-500">
            Gestión de categorías y subcategorías
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            <span>+</span> Nueva Categoría
          </button>
        )}
      </div>

      {/* Tabla o EmptyState */}
      {categorias.length === 0 ? (
        <EmptyState
          icon="◫"
          title="No hay categorías"
          description="Agregá tu primera categoría para organizar los productos."
          actionLabel={isAdmin ? "Nueva Categoría" : undefined}
          onAction={isAdmin ? handleOpenCreate : undefined}
        />
      ) : (
        <>
          <CategoriasTable
            data={categorias}
            categorias={allCategorias}
            isAdmin={isAdmin}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteRequest}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Página {page} de {totalPages} — {totalItems} categorías en total
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

      {/* Modal de crear/editar */}
      <CategoriaModal
        key={categoriaEditing?.id ?? "new"}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        categoriaEditing={categoriaEditing}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={categoriaToDelete !== null}
        onClose={() => setCategoriaToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Categoría"
        message="¿Estás seguro de que querés eliminar esta categoría? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
