import {
  ShoppingBag,
  Tag,
  FlaskConical,
  ClipboardList,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useDashboardTotals } from "../hooks/useDashboard";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  description: string;
  color: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

export function StatsCards() {
  const { data, isLoading, isError } = useDashboardTotals();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">
          Error al cargar las estadísticas del dashboard
        </p>
      </div>
    );
  }

  const stats: StatCardProps[] = [
    {
      icon: ShoppingBag,
      label: "Productos",
      value: data.total_productos,
      description: "Total en catálogo",
      color: "bg-blue-500",
    },
    {
      icon: Tag,
      label: "Categorías",
      value: data.total_categorias,
      description: "Total registradas",
      color: "bg-violet-500",
    },
    {
      icon: FlaskConical,
      label: "Ingredientes",
      value: data.total_ingredientes,
      description: "Total registrados",
      color: "bg-amber-500",
    },
    {
      icon: ClipboardList,
      label: "Pedidos",
      value: data.total_pedidos,
      description: "Total recibidos",
      color: "bg-emerald-500",
    },
    {
      icon: Users,
      label: "Usuarios",
      value: data.total_usuarios,
      description: "Total registrados",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
