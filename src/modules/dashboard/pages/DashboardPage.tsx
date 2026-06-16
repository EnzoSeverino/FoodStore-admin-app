import { useAuthStore } from "@/stores/authStore";
import { StatsCards } from "../components/StatsCards";
import { PedidosPorEstadoChart } from "../components/PedidosPorEstadoCharts";
import { VentasPorPeriodoChart } from "../components/VentasPorPeriodoChart";
import { ProductosTopChart } from "../components/ProductosTopChart";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const hasAccess =
    user?.roles?.some((r) => ["ADMIN", "STOCK", "PEDIDOS"].includes(r)) ??
    false;

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          No tenés permisos para ver el dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con saludo al usuario */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Bienvenido de vuelta, {user?.nombre}
        </p>
      </div>

      {/* Cards de estadísticas generales */}
      <StatsCards />

      {/* Gráfico de pedidos por estado (ancho completo) */}
      <PedidosPorEstadoChart />

      {/* Gráficos de ventas y productos top (2 columnas en desktop) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VentasPorPeriodoChart />
        <ProductosTopChart />
      </div>
    </div>
  );
}
