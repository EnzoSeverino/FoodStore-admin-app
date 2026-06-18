import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  useIngredientes,
  useCreateIngrediente,
  useUpdateIngrediente,
  useDeleteIngrediente,
} from "../hooks/useIngredientes";
import { IngredientesTable } from "../components/IngredientesTable";
import { IngredienteModal } from "../components/IngredienteModal";
import { SkeletonTable } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { hasRole } from "@/lib/roles";
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteUpdate,
} from "@/types/producto";

export function IngredientesPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = hasRole(user, "ADMIN");
  const toast = useToast();

  // ─── Paginación ─────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ─── Queries ────────────────────────────────────────────────────────────
  const {
    data: ingredientesData,
    isLoading,
    isError,
  } = useIngredientes(page, pageSize);

  // ─── Mutations ──────────────────────────────────────────────────────────
  const createMutation = useCreateIngrediente();
  const updateMutation = useUpdateIngrediente();
  const deleteMutation = useDeleteIngrediente();

  // ─── Estado del modal ───────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredienteEditing, setIngredienteEditing] =
    useState<Ingrediente | null>(null);

  // ─── Estado del diálogo de confirmación ─────────────────────────────────
  const [ingredienteToDelete, setIngredienteToDelete] = useState<number | null>(
    null,
  );

  // ─── Handlers del modal ─────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setIngredienteEditing(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ingrediente: Ingrediente) => {
    setIngredienteEditing(ingrediente);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIngredienteEditing(null);
  };

  // ─── Submit del formulario (crear o actualizar) ────────────────────────
  const handleSubmit = async (data: IngredienteCreate | IngredienteUpdate) => {
    try {
      if (ingredienteEditing) {
        await updateMutation.mutateAsync({ id: ingredienteEditing.id, data });
        toast.success("Ingrediente actualizado correctamente");
      } else {
        await createMutation.mutateAsync(data as IngredienteCreate);
        toast.success("Ingrediente creado correctamente");
      }
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al guardar el ingrediente",
      );
    }
  };

  // ─── Handlers de eliminación ────────────────────────────────────────────
  const handleDeleteRequest = (id: number) => {
    setIngredienteToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (ingredienteToDelete === null) return;
    try {
      await deleteMutation.mutateAsync(ingredienteToDelete);
      toast.success("Ingrediente eliminado correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar el ingrediente",
      );
    } finally {
      setIngredienteToDelete(null);
    }
  };

  // ─── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ingredientes</h1>
          <p className="text-sm text-slate-500">
            Gestión de ingredientes y alérgenos
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
          <h1 className="text-2xl font-bold text-slate-900">Ingredientes</h1>
          <p className="text-sm text-slate-500">
            Gestión de ingredientes y alérgenos
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">
            Error al cargar los ingredientes
          </p>
        </div>
      </div>
    );
  }

  const ingredientes = ingredientesData?.items ?? [];
  const totalPages = ingredientesData?.pages ?? 1;
  const totalItems = ingredientesData?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ingredientes</h1>
          <p className="text-sm text-slate-500">
            Gestión de ingredientes y alérgenos
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            <span>+</span> Nuevo Ingrediente
          </button>
        )}
      </div>

      {/* Tabla o EmptyState */}
      {ingredientes.length === 0 ? (
        <EmptyState
          icon="⚗"
          title="No hay ingredientes"
          description="Agregá tu primer ingrediente para asociarlo a los productos."
          actionLabel={isAdmin ? "Nuevo Ingrediente" : undefined}
          onAction={isAdmin ? handleOpenCreate : undefined}
        />
      ) : (
        <>
          <IngredientesTable
            data={ingredientes}
            isAdmin={isAdmin}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteRequest}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Página {page} de {totalPages} — {totalItems} ingredientes en
                total
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
      <IngredienteModal
        key={ingredienteEditing?.id ?? "new"}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        ingredienteEditing={ingredienteEditing}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={ingredienteToDelete !== null}
        onClose={() => setIngredienteToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Ingrediente"
        message="¿Estás seguro de que querés eliminar este ingrediente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
