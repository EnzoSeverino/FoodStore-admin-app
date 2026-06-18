import { useState } from "react";
import type { Usuario, UsuarioCreate, UsuarioUpdate } from "@/types/usuario";

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UsuarioUpdate | UsuarioCreate) => void;
  usuarioEditing: Usuario | null;
  isLoading: boolean;
}

export function UsuarioModal({
  isOpen,
  onClose,
  onSubmit,
  usuarioEditing,
  isLoading,
}: UsuarioModalProps) {
  const [nombre, setNombre] = useState(usuarioEditing?.nombre ?? "");
  const [email, setEmail] = useState(usuarioEditing?.email ?? "");
  const [password, setPassword] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState<string>(
    usuarioEditing?.rol ?? "CLIENT",
  );

  const creating = usuarioEditing === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) {
      const data: UsuarioCreate = {
        nombre,
        email,
        password,
        rol: rolSeleccionado,
      };
      onSubmit(data);
    } else {
      const data: UsuarioUpdate = {
        nombre: nombre || undefined,
        email: email || undefined,
        rol: rolSeleccionado || undefined,
      };
      onSubmit(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          {creating ? "Nuevo Usuario" : "Editar Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
              placeholder="Nombre completo"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
              placeholder="email@ejemplo.com"
            />
          </div>

          {/* Contraseña (solo al crear) */}
          {creating && (
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          )}

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rol
            </label>
            <select
              value={rolSeleccionado}
              onChange={(e) => setRolSeleccionado(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
            >
              <option value="CLIENT">Cliente</option>
              <option value="ADMIN">Administrador</option>
              <option value="STOCK">Gestor de Stock</option>
              <option value="PEDIDOS">Gestor de Pedidos</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Guardando..."
                : creating
                  ? "Crear Usuario"
                  : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
