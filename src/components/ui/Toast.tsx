import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";

// ─── Tipos ──────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | null>(null);

// ─── Hook useToast ──────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }

  return {
    success: (message: string) => context.showToast("success", message),
    error: (message: string) => context.showToast("error", message),
    info: (message: string) => context.showToast("info", message),
    warning: (message: string) => context.showToast("warning", message),
  };
}

// ─── Estilos por tipo ───────────────────────────────────────────────────────
const toastStyles: Record<ToastType, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
};

const toastIcons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

// ─── Componente ToastItem ───────────────────────────────────────────────────
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  // Auto-dismiss: el toast desaparece solo después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md transition-all animate-in slide-in-from-right duration-300 ${toastStyles[toast.type]}`}
      role="alert"
    >
      <span className="text-sm font-bold">{toastIcons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}

// ─── ToastProvider ──────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ID autoincremental para identificar cada toast
  const [nextId, setNextId] = useState(0);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId;
      setNextId((prev) => prev + 1);
      setToasts((prev) => [...prev, { id, type, message }]);
    },
    [nextId],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Contenedor de toasts — esquina superior derecha */}
      <div className="fixed right-4 top-4 z-100 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
