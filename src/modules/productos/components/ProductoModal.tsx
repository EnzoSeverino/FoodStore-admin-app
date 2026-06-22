import { useState } from "react";
import { ImageGallery } from "./ImageGallery";
import { useAllCategorias } from "@/modules/categorias/hooks/useCategorias";
import { useAllIngredientes } from "@/modules/ingredientes/hooks/useIngredientes";
import { useUnidadesMedida } from "../hooks/useProductos";
import { Badge } from "@/components/ui/Badge";
import type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
  CategoriaInput,
  IngredienteInput,
} from "@/types/producto";

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductoCreate | ProductoUpdate) => void;
  productoEditing: Producto | null;
  isLoading: boolean;
}

export function ProductoModal({
  isOpen,
  onClose,
  onSubmit,
  productoEditing,
  isLoading,
}: ProductoModalProps) {
  const { data: categorias = [] } = useAllCategorias();
  const { data: ingredientesDisponibles = [] } = useAllIngredientes();
  const { data: unidadesMedida = [] } = useUnidadesMedida();

  const [nombre, setNombre] = useState(productoEditing?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(
    productoEditing?.descripcion ?? "",
  );
  const [precioBase, setPrecioBase] = useState(
    productoEditing?.precio_base.toString() ?? "",
  );
  const [stockCantidad, setStockCantidad] = useState(
    productoEditing?.stock_cantidad.toString() ?? "",
  );
  const [disponible, setDisponible] = useState(
    productoEditing?.disponible ?? true,
  );
  const [imagenesUrl, setImagenesUrl] = useState<string[]>(
    productoEditing?.imagenes_url ?? [],
  );
  const [unidadVentaId, setUnidadVentaId] = useState<number | null>(
    productoEditing?.unidad_venta_id ?? null,
  );
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<
    CategoriaInput[]
  >(
    productoEditing?.categorias.map((c) => ({
      id: c.id,
      es_principal: c.es_principal,
    })) ?? [],
  );
  const [ingredientes, setIngredientes] = useState<IngredienteInput[]>(
    productoEditing?.ingredientes.map((i) => ({
      ingrediente_id: i.id,
      cantidad: i.cantidad ?? 1,
      unidad_medida_id: i.unidad_medida_id ?? unidadesMedida[0]?.id ?? 1,
      es_removible: i.es_removible,
    })) ?? [],
  );

  // ─── Handlers de categorías ─────────────────────────────────────────────
  const handleToggleCategoria = (id: number) => {
    setCategoriasSeleccionadas((prev) => {
      const existe = prev.find((c) => c.id === id);
      if (existe) return prev.filter((c) => c.id !== id);
      return [...prev, { id, es_principal: prev.length === 0 }];
    });
  };

  const handleTogglePrincipal = (id: number) => {
    setCategoriasSeleccionadas((prev) =>
      prev.map((c) => ({ ...c, es_principal: c.id === id })),
    );
  };

  // ─── Handlers de ingredientes ───────────────────────────────────────────
  const handleToggleIngrediente = (ingredienteId: number) => {
    setIngredientes((prev) => {
      const existe = prev.find((i) => i.ingrediente_id === ingredienteId);
      if (existe) {
        return prev.filter((i) => i.ingrediente_id !== ingredienteId);
      }
      return [
        ...prev,
        {
          ingrediente_id: ingredienteId,
          cantidad: 1,
          unidad_medida_id: unidadesMedida[0]?.id ?? 1,
          es_removible: false,
        },
      ];
    });
  };

  const handleUpdateIngrediente = (
    ingredienteId: number,
    field: keyof IngredienteInput,
    value: number | boolean,
  ) => {
    setIngredientes((prev) =>
      prev.map((i) =>
        i.ingrediente_id === ingredienteId ? { ...i, [field]: value } : i,
      ),
    );
  };

  // ─── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: ProductoCreate | ProductoUpdate = {
      nombre,
      descripcion: descripcion || undefined,
      precio_base: Number(precioBase),
      stock_cantidad: Number(stockCantidad),
      disponible,
      imagenes_url: imagenesUrl.length > 0 ? imagenesUrl : undefined,
      unidad_venta_id: unidadVentaId,
      categorias: categoriasSeleccionadas,
      ingredientes_ids: ingredientes.map((i) => i.ingrediente_id),
    };

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          {productoEditing ? "Editar Producto" : "Nuevo Producto"}
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
              placeholder="Nombre del producto"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
              placeholder="Descripción opcional"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Precio
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={stockCantidad}
                onChange={(e) => setStockCantidad(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
                placeholder="0"
              />
            </div>
          </div>

          {/* Disponible */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="disponible"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300"
            />
            <label
              htmlFor="disponible"
              className="text-sm font-medium text-slate-700"
            >
              Disponible para la venta
            </label>
          </div>

          {/* Unidad de Venta */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Unidad de Venta
            </label>
            <select
              value={unidadVentaId ?? ""}
              onChange={(e) =>
                setUnidadVentaId(e.target.value ? Number(e.target.value) : null)
              }
              disabled={isLoading}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
            >
              <option value="">Sin unidad (producto unitario)</option>
              {unidadesMedida.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({u.simbolo})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Ej: "kg" para vender por peso, "L" para vender por volumen
            </p>
          </div>

          {/* Galería de Imágenes (Cloudinary) */}
          <ImageGallery
            imagenes={imagenesUrl}
            onImagesChange={setImagenesUrl}
            disabled={isLoading}
          />

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Categorías
            </label>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-300 p-3 space-y-2">
              {categorias.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No hay categorías cargadas
                </p>
              ) : (
                categorias.map((c) => {
                  const seleccionada = categoriasSeleccionadas.find(
                    (cs) => cs.id === c.id,
                  );
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`cat-${c.id}`}
                        checked={!!seleccionada}
                        onChange={() => handleToggleCategoria(c.id)}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      <label
                        htmlFor={`cat-${c.id}`}
                        className="text-sm text-slate-700 flex-1"
                      >
                        {c.nombre}
                      </label>
                      {seleccionada && (
                        <button
                          type="button"
                          onClick={() => handleTogglePrincipal(c.id)}
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            seleccionada.es_principal
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {seleccionada.es_principal
                            ? "Principal"
                            : "Secundaria"}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ingredientes
            </label>
            <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-300 p-3 space-y-3">
              {ingredientesDisponibles.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No hay ingredientes cargados
                </p>
              ) : (
                ingredientesDisponibles.map((ing) => {
                  const seleccionado = ingredientes.find(
                    (i) => i.ingrediente_id === ing.id,
                  );
                  return (
                    <div key={ing.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`ing-${ing.id}`}
                          checked={!!seleccionado}
                          onChange={() => handleToggleIngrediente(ing.id)}
                          disabled={isLoading}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <label
                          htmlFor={`ing-${ing.id}`}
                          className="text-sm text-slate-700 flex-1"
                        >
                          {ing.nombre}
                          {ing.es_alergeno && (
                            <Badge variant="danger" className="ml-2">
                              Alérgeno
                            </Badge>
                          )}
                        </label>
                      </div>

                      {/* Campos adicionales si está seleccionado */}
                      {seleccionado && (
                        <div className="ml-6 grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">
                              Cantidad
                            </label>
                            <input
                              type="number"
                              min="0.001"
                              step="0.001"
                              value={seleccionado.cantidad}
                              onChange={(e) =>
                                handleUpdateIngrediente(
                                  ing.id,
                                  "cantidad",
                                  Number(e.target.value),
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-600 mb-1">
                              Unidad
                            </label>
                            <select
                              value={seleccionado.unidad_medida_id}
                              onChange={(e) =>
                                handleUpdateIngrediente(
                                  ing.id,
                                  "unidad_medida_id",
                                  Number(e.target.value),
                                )
                              }
                              disabled={isLoading}
                              className="w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
                            >
                              {unidadesMedida.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.simbolo}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-end">
                            <label className="flex items-center gap-2 text-xs text-slate-600">
                              <input
                                type="checkbox"
                                checked={seleccionado.es_removible}
                                onChange={(e) =>
                                  handleUpdateIngrediente(
                                    ing.id,
                                    "es_removible",
                                    e.target.checked,
                                  )
                                }
                                disabled={isLoading}
                                className="h-3 w-3 rounded border-slate-300"
                              />
                              Removible
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              "Removible" permite al cliente quitar este ingrediente de su
              pedido
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
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
