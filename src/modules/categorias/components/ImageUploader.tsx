import { useState, useRef } from "react";
import { uploadImage, deleteImagen } from "@/api/uploadsApi";
import type { CloudinaryResponse } from "@/types/producto";

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  currentPublicId?: string | null;
  onUpload: (secureUrl: string, publicId: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageUploader({
  currentImageUrl,
  currentPublicId,
  onUpload,
  onRemove,
  disabled = false,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl ?? null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Formato no válido. Usá JPG, PNG o WebP.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `La imagen supera los ${MAX_SIZE_MB} MB permitidos.`;
    }
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);

      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      const response: CloudinaryResponse = await uploadImage(file);

      setPreviewUrl(response.secure_url);

      onUpload(response.secure_url, response.public_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
      setPreviewUrl(currentImageUrl ?? null);
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (currentPublicId) {
      try {
        await deleteImagen(currentPublicId);
      } catch {
      }
    }

    setPreviewUrl(null);
    onRemove();
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Imagen</label>
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                <span className="text-xs text-white font-medium">
                  Subiendo...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={disabled || isUploading ? undefined : handleSelectClick}
            className={`flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors 
                            ${
                              disabled || isUploading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:border-slate-400 hover:bg-slate-100"
                            }
                        `}
          >
            <span className="text-2xl text-slate-400">+</span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSelectClick}
            disabled={disabled || isUploading}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {previewUrl ? "Cambiar imagen" : "Seleccionar imagen"}
          </button>

          {previewUrl && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Eliminar imagen
            </button>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-slate-400">
        JPG, PNG o WebP. Máximo {MAX_SIZE_MB} MB.
      </p>
    </div>
  );
}