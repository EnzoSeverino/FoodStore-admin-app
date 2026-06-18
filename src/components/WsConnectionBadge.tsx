import { useWsStore } from "@/stores/wsStore";

// ─── WsConnectionBadge ─────────────────────────────────────────────────────
export function WsConnectionBadge() {
  const status = useWsStore((s) => s.status);
  const lastEvent = useWsStore((s) => s.lastEvent);

  // ─── Configuración visual por estado ────────────────────────────────────
  const statusConfig = {
    connected: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50 border-green-200",
      label: "En vivo",
      pulse: false,
    },
    connecting: {
      dotColor: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50 border-yellow-200",
      label: "Conectando...",
      pulse: true,
    },
    disconnected: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50 border-red-200",
      label: "Sin conexión",
      pulse: false,
    },
    error: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50 border-red-200",
      label: "Error de conexión",
      pulse: false,
    },
  };

  const config = statusConfig[status];

  // ─── Calcular tiempo desde el último evento ─────────────────────────────
  const lastUpdateText = lastEvent
    ? `Última actualización: ${new Date(lastEvent.timestamp).toLocaleTimeString()}`
    : "Sin eventos recibidos";

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${config.bgColor}`}
      title={lastUpdateText}
    >
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.dotColor} opacity-75`}
          />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.dotColor}`}
        />
      </span>
      {/* Texto FUERA del span del punto */}
      <span className={`text-xs font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
