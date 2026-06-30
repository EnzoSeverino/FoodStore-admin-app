import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useProductosTop } from "../hooks/useDashboard";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";


const barColors = [
  "#1e40af", // blue-800 — posición 1
  "#2563eb", // blue-600 — posición 2
  "#3b82f6", // blue-500 — posición 3
  "#60a5fa", // blue-400 — posición 4
  "#93c5fd", // blue-300 — posición 5
  "#bfdbfe", // blue-200 — posición 6+
  "#dbeafe", // blue-100 — posición 7+
  "#eff6ff", // blue-50  — posición 8+
];

export function ProductosTopChart() {
  const { data, isLoading, isError } = useProductosTop(10);

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString("es-AR")}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <SkeletonLoader className="h-5 w-48 mb-4" />
        <SkeletonLoader className="h-80 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">
          Error al cargar el ranking de productos
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Productos Más Vendidos
        </h3>
        <EmptyState
          icon="🏆"
          title="No hay ventas registradas"
          description="Aún no se han vendido productos para mostrar en el ranking."
        />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    nombre: item.nombre,
    cantidad: item.cantidad_total,
    monto: item.monto_total,
  }));

  const chartHeight = Math.max(300, data.length * 40 + 60);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Productos Más Vendidos (Top 10)
      </h3>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            tick={{ fontSize: 12, fill: "#334155" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "cantidad") return [`${value} unidades`, "Cantidad"];
              return [formatCurrency(value), "Monto"];
            }}
            labelFormatter={(label) => `Producto: ${label}`}
          />
          <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={barColors[index] ?? barColors[barColors.length - 1]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}