import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
  CodigoRol,
} from "@/types/usuario";

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UsuarioUpdate | UsuarioCreate) => void;
  usuarioEditing: Usuario | null;
  isLoading: boolean;
}

const rolesConfig: {
  codigo: CodigoRol;
  label: string;
  descripcion: string;
  variant: "danger" | "info" | "warning" | "success";
}[] = [
  {
    codigo: "ADMIN",
    label: "Administrador",
    descripcion:
      "CRUD completo: usuarios, categorías, productos, pedidos, stock",
    variant: "danger",
  },
  {
    codigo: "STOCK",
    label: "Gestor de Stock",
    descripcion: "Ver productos, actualizar stock y disponibilidad",
    variant: "warning",
  },
  {
    codigo: "PEDIDOS",
    label: "Gestor de Pedidos",
    descripcion: "Ver pedidos, avanzar estados, ver historial",
    variant: "info",
  },
  {
    codigo: "CLIENT",
    label: "Cliente",
    descripcion: "Ver catálogo, crear pedidos, ver sus propios pedidos",
    variant: "success",
  },
];

export function UsuarioModal({
  isOpen,
  onClose,
  onSubmit,
  usuarioEditing,
  isLoading,
}: UsuarioModalProps) {
  const [nombre, setNombre] = useState(usuarioEditing?.nombre ?? "");
  const [apellido, setApellido] = useState(usuarioEditing?.apellido ?? "");
  const [email, setEmail] = useState(usuarioEditing?.email ?? "");
  const [celular, setCelular] = useState(usuarioEditing?.celular ?? "");
  const [password, setPassword] = useState("");
  const [rolesSeleccionados, setRolesSeleccionados] = useState<CodigoRol[]>(
    usuarioEditing?.roles.map((r) => r.rol_codigo) ?? [],
  );

  const creating = usuarioEditing === null;

  const handleToggleRol = (codigo: CodigoRol) => {
    setRolesSeleccionados((prev) =>
      prev.includes(codigo)
        ? prev.filter((r) => r !== codigo)
        : [...prev, codigo],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) {
      const data: UsuarioCreate = {
        nombre,
        apellido,
        email,
        password,
        celular: celular || undefined,
        roles: rolesSeleccionados,
      };
      onSubmit(data);
    } else {
      const data: UsuarioUpdate = {
        nombre: nombre || undefined,
        apellido: apellido || undefined,
        email: email || undefined,
        celular: celular || undefined,
        roles: rolesSeleccionados.length > 0 ? rolesSeleccionados : undefined,
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
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
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
                placeholder="Nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
                placeholder="Apellido"
              />
            </div>
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

          {/* Celular */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Celular
            </label>
            <input
              type="tel"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
              placeholder="+54 9 11 1234-5678"
            />
            <p className="mt-1 text-xs text-slate-500">Opcional</p>
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

          {/* Roles (múltiple selección) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Roles
            </label>
            <div className="space-y-2 rounded-lg border border-slate-300 p-3 max-h-48 overflow-y-auto">
              {rolesConfig.map((rol) => {
                const seleccionado = rolesSeleccionados.includes(rol.codigo);
                return (
                  <label
                    key={rol.codigo}
                    className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      seleccionado ? "bg-slate-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      onChange={() => handleToggleRol(rol.codigo)}
                      disabled={isLoading}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          {rol.label}
                        </span>
                        <Badge variant={rol.variant}>{rol.codigo}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {rol.descripcion}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Un usuario puede tener múltiples roles simultáneamente
            </p>
          </div>

          {/* Botones de acción */}
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
              disabled={isLoading || rolesSeleccionados.length === 0}
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
