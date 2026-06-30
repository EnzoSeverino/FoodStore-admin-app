import { useState } from "react";
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteUpdate,
} from "@/types/producto";

interface IngredienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IngredienteCreate | IngredienteUpdate) => void;
  ingredienteEditing: Ingrediente | null;
  isLoading: boolean;
}

export function IngredienteModal({
  isOpen,
  onClose,
  onSubmit,
  ingredienteEditing,
  isLoading,
}: IngredienteModalProps) {
  const [nombre, setNombre] = useState(ingredienteEditing?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(
    ingredienteEditing?.descripcion ?? "",
  );
  const [stockCantidad, setStockCantidad] = useState(
    ingredienteEditing?.stock_cantidad ?? 0,
  );
  const [esAlergeno, setEsAlergeno] = useState(
    ingredienteEditing?.es_alergeno ?? false,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: IngredienteCreate | IngredienteUpdate = {
      nombre,
      descripcion: descripcion || undefined,
      stock_cantidad: stockCantidad,
      es_alergeno: esAlergeno,
    };

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          {ingredienteEditing ? "Editar Ingrediente" : "Nuevo Ingrediente"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Nombre del ingrediente"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Stock
            </label>
            <input
              type="number"
              value={stockCantidad}
              onChange={(e) => setStockCantidad(Number(e.target.value))}
              min={0}
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-slate-400">
              Cantidad disponible en inventario
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="es_alergeno"
              checked={esAlergeno}
              onChange={(e) => setEsAlergeno(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 disabled:opacity-50"
            />
            <label
              htmlFor="es_alergeno"
              className="text-sm font-medium text-slate-700"
            >
              Es alérgeno
            </label>
          </div>
          {esAlergeno && (
            <p className="text-xs text-amber-600">
              ⚠ Este ingrediente se mostrará con una advertencia de alérgeno en
              el catálogo
            </p>
          )}
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