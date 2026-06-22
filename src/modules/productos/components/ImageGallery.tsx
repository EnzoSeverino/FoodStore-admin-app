import { useState } from "react";
import { useUploadImage, useDeleteImage } from "../hooks/useProductos";
import type { CloudinaryResponse } from "@/types/producto";

interface ImageGalleryProps {
  imagenes: string[];
  onImagesChange: (imagenes: string[]) => void;
  disabled?: boolean;
}

export function ImageGallery({
  imagenes,
  onImagesChange,
  disabled = false,
}: ImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Cloudinary no nos da el public_id de vuelta al leer el producto (solo la URL),
  // así que solo podemos asociar public_id a imágenes subidas en esta sesión.
  // Las imágenes ya existentes del producto se borran solo del array local.
  const [publicIdsPorUrl, setPublicIdsPorUrl] = useState<
    Record<string, string>
  >({});

  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const response: CloudinaryResponse =
        await uploadMutation.mutateAsync(file);
      setPublicIdsPorUrl((prev) => ({
        ...prev,
        [response.secure_url]: response.public_id,
      }));
      onImagesChange([...imagenes, response.secure_url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (index: number) => {
    const url = imagenes[index];
    const publicId = publicIdsPorUrl[url];

    try {
      if (publicId) {
        await deleteMutation.mutateAsync(publicId);
      }
      onImagesChange(imagenes.filter((_, i) => i !== index));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar la imagen",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Imágenes del producto
        </label>
        <span className="text-xs text-slate-500">
          {imagenes.length} {imagenes.length === 1 ? "imagen" : "imágenes"}
        </span>
      </div>

      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {imagenes.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Producto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                disabled={disabled || deleteMutation.isPending}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label
          className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 
          cursor-pointer hover:bg-slate-50 transition-colors
          ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
        >
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-sm text-slate-700">
            {uploading ? "Subiendo..." : "Agregar imagen"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-slate-500">
        Las imágenes se suben a Cloudinary. Formatos aceptados: JPG, PNG, WebP.
        Tamaño máximo: 5MB.
      </p>
    </div>
  );
}
