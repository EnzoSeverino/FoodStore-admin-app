import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { hasRole } from "@/lib/roles";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

export function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasRole(user, ...roles)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
