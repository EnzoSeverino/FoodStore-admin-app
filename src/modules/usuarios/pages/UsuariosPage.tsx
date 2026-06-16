import { useState } from "react";
import {
  useUsuarios,
  useCreateUsuario,
  useUpdateUsuario,
  useDeleteUsuario,
} from "../hooks/useUsuarios";
import { UsuariosTable } from "../components/UsuariosTable";
import { UsuarioModal } from "../components/UsuarioModal";
import { SkeletonTable } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { Usuario, UsuarioCreate, UsuarioUpdate } from "@/types/usuario";

export function UsuariosPage() {
  const toast = useToast();

  // ─── Paginación ─────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ─── Queries ────────────────────────────────────────────────────────────
  const {
    data: usuariosData,
    isLoading,
    isError,
  } = useUsuarios(page, pageSize);

  // ─── Mutations ──────────────────────────────────────────────────────────
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario();
  const deleteMutation = useDeleteUsuario();

  // ─── Estado del modal ───────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEditing, setUsuarioEditing] = useState<Usuario | null>(null);

  // ─── Estado del diálogo de confirmación ─────────────────────────────────
  const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null);

  // ─── Handlers del modal ─────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setUsuarioEditing(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (usuario: Usuario) => {
    setUsuarioEditing(usuario);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setUsuarioEditing(null);
  };

  // ─── Submit del formulario (crear o actualizar) ────────────────────────
  const handleSubmit = async (data: UsuarioCreate | UsuarioUpdate) => {
    try {
      if (usuarioEditing) {
        await updateMutation.mutateAsync({
          id: usuarioEditing.id,
          data: data as UsuarioUpdate,
        });
        toast.success("Usuario actualizado correctamente");
      } else {
        await createMutation.mutateAsync(data as UsuarioCreate);
        toast.success("Usuario creado correctamente");
      }
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el usuario",
      );
    }
  };

  // ─── Handlers de eliminación ────────────────────────────────────────────
  const handleDeleteRequest = (id: number) => {
    setUsuarioToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (usuarioToDelete === null) return;
    try {
      await deleteMutation.mutateAsync(usuarioToDelete);
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar el usuario",
      );
    } finally {
      setUsuarioToDelete(null);
    }
  };

  // ─── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500">
            Gestión de usuarios del sistema
          </p>
        </div>
        <SkeletonTable rows={5} columns={7} />
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500">
            Gestión de usuarios del sistema
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">Error al cargar los usuarios</p>
        </div>
      </div>
    );
  }

  const usuarios = usuariosData?.items ?? [];
  const totalPages = usuariosData?.pages ?? 1;
  const totalItems = usuariosData?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500">
            Gestión de usuarios del sistema
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      {/* Tabla o EmptyState */}
      {usuarios.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No hay usuarios"
          description="Agregá el primer usuario del sistema."
          actionLabel="Nuevo Usuario"
          onAction={handleOpenCreate}
        />
      ) : (
        <>
          <UsuariosTable
            data={usuarios}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteRequest}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Página {page} de {totalPages} — {totalItems} usuarios en total
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
      <UsuarioModal
        key={usuarioEditing?.id ?? "new"}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        usuarioEditing={usuarioEditing}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={usuarioToDelete !== null}
        onClose={() => setUsuarioToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message="¿Estás seguro de que querés eliminar este usuario? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
