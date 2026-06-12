import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage";
import { CategoriasPage } from "@/modules/categorias/pages/CategoriasPage";
import { IngredientesPage } from "@/modules/ingredientes/pages/IngredientesPage";
import { ProductosPage } from "@/modules/productos/pages/ProductosPage";
import { PedidosPage } from "@/modules/pedidos/pages/PedidosPage";
import { PedidoDetallePage } from "@/modules/pedidos/pages/PedidoDetallePage";
import { StockPage } from "@/modules/stock/pages/StockPage";
import { UsuariosPage } from "@/modules/usuarios/pages/UsuariosPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace/>
    },
    {
        path: '/auth',
        element: (
            <PublicRoute>
                <AuthLayout />
            </PublicRoute>
        ),
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
        ],
    },
    {
        path: '/',
        element: (
            <PrivateRoute>
                <AppLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'categorias',
                element: (
                    <PrivateRoute requiredRole="ADMIN">
                        <CategoriasPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'ingredientes',
                element: (
                    <PrivateRoute requiredRole="ADMIN">
                        <IngredientesPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'productos',
                element: (
                    <PrivateRoute requiredRole={['ADMIN', 'STOCK']}>
                        <ProductosPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'pedidos',
                element: (
                    <PrivateRoute requiredRole={['ADMIN', 'PEDIDOS']}>
                        <PedidosPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'pedidos/:id',
                element: (
                    <PrivateRoute requiredRole={['ADMIN', 'PEDIDOS']}>
                        <PedidoDetallePage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'stock',
                element: (
                    <PrivateRoute requiredRole={['ADMIN', 'STOCK']}>
                        <StockPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'usuarios',
                element: (
                    <PrivateRoute requiredRole="ADMIN">
                        <UsuariosPage />
                    </PrivateRoute>
                ),
            },
        ],
    },
])

export function AppRouter() {
    return <RouterProvider router={router} />
}