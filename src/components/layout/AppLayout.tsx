import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Tag,
  FlaskConical,
  ShoppingBag,
  ClipboardList,
  Package,
  Users,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useAdminOrdersFeed } from "@/hooks/useAdminOrdersFeed";
import { WsConnectionBadge } from "../WsConnectionBadge";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: string[];
};

const allNavItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "STOCK", "PEDIDOS"],
  },
  { to: "/categorias", label: "Categorías", icon: Tag, roles: ["ADMIN"] },
  {
    to: "/ingredientes",
    label: "Ingredientes",
    icon: FlaskConical,
    roles: ["ADMIN"],
  },
  {
    to: "/productos",
    label: "Productos",
    icon: ShoppingBag,
    roles: ["ADMIN", "STOCK"],
  },
  {
    to: "/pedidos",
    label: "Pedidos",
    icon: ClipboardList,
    roles: ["ADMIN", "PEDIDOS"],
  },
  { to: "/stock", label: "Stock", icon: Package, roles: ["ADMIN", "STOCK"] },
  { to: "/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN"] },
];

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useAdminOrdersFeed();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">FoodStore</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 ml-9">
            {user?.rol ?? "Admin"}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {allNavItems
            .filter((item) =>
              user?.rol ? item.roles.includes(user.rol.toUpperCase()) : false,
            )
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold shrink-0">
              {user?.nombre?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-end border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <WsConnectionBadge />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
              {user?.nombre?.charAt(0).toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
