import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Producto } from "@/types/producto";
import { Badge } from "@/components/ui/Badge";

interface StockTableProps {
  data: Producto[];
  onToggleDisponibilidad: (id: number, disponible: boolean) => void;
}

const columnHelper = createColumnHelper<Producto>();

export function StockTable({ data, onToggleDisponibilidad }: StockTableProps) {
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="text-slate-400 text-xs">#{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("imagenes_url", {
      header: "Imagen",
      cell: (info) => {
        const imagenes = info.getValue();
        if (!imagenes || imagenes.length === 0) {
          return (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              <span className="text-xs text-slate-400">—</span>
            </div>
          );
        }
        return (
          <img
            src={imagenes[0].url} // ← imagenes[0].url en vez de imagenes[0]
            alt="Producto"
            className="h-12 w-12 rounded-lg object-cover border border-slate-200"
          />
        );
      },
    }),
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => (
        <div>
          <p className="font-medium text-slate-900">{info.getValue()}</p>
          {info.row.original.descripcion && (
            <p className="text-xs text-slate-500 truncate max-w-xs">
              {info.row.original.descripcion}
            </p>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("stock_cantidad", {
      header: "Stock",
      cell: (info) => {
        const stock = info.getValue();
        return (
          <span
            className={`font-medium ${
              stock === 0
                ? "text-red-600"
                : stock < 10
                  ? "text-amber-600"
                  : "text-slate-900"
            }`}
          >
            {stock}
          </span>
        );
      },
    }),
    columnHelper.accessor("disponible", {
      header: "Disponible",
      cell: (info) => {
        const producto = info.row.original;
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={info.getValue()}
              onChange={(e) =>
                onToggleDisponibilidad(producto.id, e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        );
      },
    }),
    columnHelper.accessor("categorias", {
      header: "Categorías",
      cell: (info) => {
        const categorias = info.getValue();
        if (!categorias || categorias.length === 0) return "—";
        return (
          <div className="flex flex-wrap gap-1">
            {categorias.slice(0, 2).map((c) => (
              <Badge key={c.id} variant="default">
                {c.nombre}
              </Badge>
            ))}
            {categorias.length > 2 && (
              <Badge variant="info">+{categorias.length - 2}</Badge>
            )}
          </div>
        );
      },
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
                No hay productos cargados
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
