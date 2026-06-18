# FoodStore — Panel de Administración
 
Panel de administración web para el sistema de gestión de pedidos **FoodStore**.  
Permite a administradores, gestores de stock y gestores de pedidos gestionar el catálogo, pedidos, usuarios y visualizar estadísticas en tiempo real.
 
## Stack
 
- **React 18** + **TypeScript**
- **Vite** — build tool y dev server
- **Tailwind CSS** — estilos utility-first
- **TanStack Query v5** — fetching y caché de datos del servidor
- **Zustand** — estado global del cliente (auth, carrito, WebSocket)
- **Axios** — cliente HTTP con interceptors JWT
- **Recharts** — gráficos del dashboard
- **Lucide React** — iconografía
- **TanStack Table** — tablas con columnas configurables
## Requisitos previos
 
- Node.js 18+
- pnpm
- Backend corriendo en `http://localhost:8000` ([FoodStore Backend](https://github.com/Valentino-24/FoodStore-back-app))
## Instalación y uso
 
```bash
# 1. Clonar el repositorio
git clone https://github.com/EnzoSeverino/FoodStore-admin-app.git
cd FoodStore-admin-app
 
# 2. Instalar dependencias
pnpm install
 
# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend
 
# 4. Iniciar el servidor de desarrollo
pnpm dev
```
 
La app estará disponible en `http://localhost:5173`.
 
## Variables de entorno
 
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```
 
## Roles y permisos
 
| Rol | Acceso |
|-----|--------|
| `ADMIN` | Dashboard, Categorías, Ingredientes, Productos, Pedidos, Stock, Usuarios |
| `STOCK` | Dashboard, Productos, Stock |
| `PEDIDOS` | Dashboard, Pedidos |
| `CLIENT` | Sin acceso al panel |
 
## Funcionalidades
 
### Dashboard
- KPIs: total de productos, categorías, ingredientes, pedidos y usuarios
- Gráfico de ventas por período (líneas)
- Gráfico de productos más vendidos (barras)
- Gráfico de pedidos por estado (torta)
### Categorías
- CRUD completo con soporte de jerarquía padre/hijo
- Upload de imagen vía Cloudinary
### Ingredientes
- CRUD completo
- Badge de alérgeno
### Productos
- CRUD completo con búsqueda, filtros por categoría y disponibilidad
- Múltiples imágenes vía Cloudinary
- Asignación de categorías e ingredientes
- Toggle de disponibilidad
### Pedidos
- Listado con filtro por estado
- Detalle con timeline de historial de estados
- Avance de estado según FSM: `PENDIENTE → CONFIRMADO → EN_PREP → ENTREGADO`
- Cancelación con motivo obligatorio
- Actualización en tiempo real vía WebSocket
### Stock
- Gestión de disponibilidad de productos
- Búsqueda con debounce
### Usuarios
- CRUD completo
- Asignación de rol: `ADMIN`, `STOCK`, `PEDIDOS`, `CLIENT`
- Soft delete
## Arquitectura del frontend
 
```
src/
├── api/          # Funciones de llamada a la API (Axios)
├── components/   # Componentes UI reutilizables
├── hooks/        # Hooks globales (WebSocket, debounce)
├── lib/          # Utilidades (roles, helpers)
├── modules/      # Módulos por feature (Feature-Sliced Design)
│   ├── auth/
│   ├── categorias/
│   ├── dashboard/
│   ├── ingredientes/
│   ├── pedidos/
│   ├── productos/
│   ├── stock/
│   └── usuarios/
├── router/       # Configuración de rutas y PrivateRoute
├── stores/       # Stores Zustand (auth, ws)
└── types/        # Tipos TypeScript globales
```
 
## WebSocket
 
El panel se conecta automáticamente al WebSocket del backend al iniciar sesión.  
El badge en el header muestra el estado de la conexión en tiempo real.  
Cuando un pedido cambia de estado desde cualquier cliente, la tabla de pedidos y el detalle se actualizan sin recargar la página.