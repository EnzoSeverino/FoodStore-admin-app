import type { ReactNode } from "react";

// ─── EmptyState ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      {/* Icono */}
      <span className="mb-4 text-4xl">{icon}</span>

      {/* Título */}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      {/* Descripción opcional */}
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}

      {/* Botón de acción opcional */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          {actionLabel}
        </button>
      )}

      {children}
    </div>
  );
}
