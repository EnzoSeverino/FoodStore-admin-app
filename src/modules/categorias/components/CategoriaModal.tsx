import { useState } from "react";
import { useAllCategorias } from "../hooks/useCategorias";
import { ImageUploader } from "./ImageUploader";
import type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from "@/types/categoria";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoriaCreate | CategoriaUpdate) => void;
  categoriaEditing: Categoria | null;
  isLoading: boolean;
}

export function CategoriaModal({
  isOpen,
  onClose,
  onSubmit,
  categoriaEditing,
  isLoading,
}: CategoriaModalProps) {
  // Estados inicializados directamente desde categoriaEditing (sin useEffect)
  const [nombre, setNombre] = useState(categoriaEditing?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(
    categoriaEditing?.descripcion ?? "",
  );
  const [parentId, setParentId] = useState<number | null>(
    categoriaEditing?.parent_id ?? null,
  );
  const [imagenUrl, setImagenUrl] = useState<string | null>(
    categoriaEditing?.imagen_url ?? null,
  );
  const [imagenPublicId, setImagenPublicId] = useState<string | null>(null);

  const { data: categorias = [] } = useAllCategorias();

  // ─── Manejar submit ─────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: CategoriaCreate | CategoriaUpdate = {
      nombre,
      descripcion: descripcion || undefined,
      parent_id: parentId,
      imagen_url: imagenUrl,
    };

    onSubmit(data);
  };

  // ─── Filtrar categoría actual del select de padre ───────────────────────
  const categoriasFiltradas = categorias.filter(
    (c) => c.id !== categoriaEditing?.id,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          {categoriaEditing ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nombre */}
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
              placeholder="Nombre de la categoría"
            />
          </div>

          {/* Campo: Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
              placeholder="Descripción opcional"
            />
          </div>

          {/* Campo: Categoría Padre */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Categoría Padre
            </label>
            <select
              value={parentId ?? ""}
              onChange={(e) =>
                setParentId(e.target.value ? Number(e.target.value) : null)
              }
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
            >
              <option value="">Sin categoría padre (raíz)</option>
              {categoriasFiltradas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Imagen (Cloudinary) */}
          <ImageUploader
            currentImageUrl={imagenUrl}
            currentPublicId={imagenPublicId}
            onUpload={(secureUrl, publicId) => {
              setImagenUrl(secureUrl);
              setImagenPublicId(publicId);
            }}
            onRemove={() => {
              setImagenUrl(null);
              setImagenPublicId(null);
            }}
            disabled={isLoading}
          />

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
              disabled={isLoading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
