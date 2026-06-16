import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Usuario, CodigoRol } from "@/types/usuario";
import { Badge } from "@/components/ui/Badge";

interface UsuariosTableProps {
  data: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Usuario>();

// ─── Configuración de badges por rol ────────────────────────────────────────
const rolVariant: Record<CodigoRol, "danger" | "warning" | "info" | "success"> =
  {
    ADMIN: "danger",
    STOCK: "warning",
    PEDIDOS: "info",
    CLIENT: "success",
  };

export function UsuariosTable({ data, onEdit, onDelete }: UsuariosTableProps) {
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="text-slate-400 text-xs">#{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => (
        <div>
          <p className="font-medium text-slate-900">
            {info.getValue()} {info.row.original.apellido}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <span className="text-sm text-slate-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("celular", {
      header: "Celular",
      cell: (info) => {
        const celular = info.getValue();
        return <span className="text-sm text-slate-600">{celular ?? "—"}</span>;
      },
    }),
    columnHelper.accessor("roles", {
      header: "Roles",
      cell: (info) => {
        const roles = info.getValue();
        if (!roles || roles.length === 0) return "—";
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <Badge key={r.rol_codigo} variant={rolVariant[r.rol_codigo]}>
                {r.rol_codigo}
              </Badge>
            ))}
          </div>
        );
      },
    }),
    columnHelper.accessor("deleted_at", {
      header: "Estado",
      cell: (info) =>
        info.getValue() === null ? (
          <Badge variant="success">Activo</Badge>
        ) : (
          <Badge variant="danger">Inactivo</Badge>
        ),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: (info) =>
        info.row.original.deleted_at === null ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(info.row.original)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(info.row.original.id)}
              className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Eliminar
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Eliminado</span>
        ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center text-slate-400"
              >
                No hay usuarios cargados
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4 text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
