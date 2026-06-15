import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { PedidoRead } from "@/types/pedido";
import { Badge } from "@/components/ui/Badge";
import { EstadoActions } from "./EstadoActions";

interface PedidosTableProps {
  data: PedidoRead[];
  onCancelarClick: (pedido: PedidoRead) => void;
}

const columnHelper = createColumnHelper<PedidoRead>();

export function PedidosTable({ data, onCancelarClick }: PedidosTableProps) {
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <button
          onClick={() => navigate(`/pedidos/${info.getValue()}`)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          #{info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor("usuario_id", {
      header: "Cliente",
      cell: (info) => (
        <span className="text-sm text-slate-700">
          Usuario #{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("estado_codigo", {
      header: "Estado",
      cell: (info) => {
        const estadoVariant: Record<
          string,
          "warning" | "info" | "success" | "danger" | "default"
        > = {
          PENDIENTE: "warning",
          CONFIRMADO: "info",
          EN_PREP: "warning",
          ENTREGADO: "success",
          CANCELADO: "danger",
        };
        const estadoLabels: Record<string, string> = {
          PENDIENTE: "Pendiente",
          CONFIRMADO: "Confirmado",
          EN_PREP: "En Preparación",
          ENTREGADO: "Entregado",
          CANCELADO: "Cancelado",
        };
        return (
          <Badge variant={estadoVariant[info.getValue()] ?? "default"}>
            {estadoLabels[info.getValue()] ?? info.getValue()}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("subtotal", {
      header: "Subtotal",
      cell: (info) => (
        <span className="text-sm text-slate-600">
          ${info.getValue().toFixed(2)}
        </span>
      ),
    }),
    columnHelper.accessor("descuento", {
      header: "Descuento",
      cell: (info) => {
        const descuento = info.getValue();
        if (descuento === 0) return <span className="text-slate-400">—</span>;
        return (
          <span className="text-sm text-green-600">
            -${descuento.toFixed(2)}
          </span>
        );
      },
    }),
    columnHelper.accessor("costo_envio", {
      header: "Envío",
      cell: (info) => (
        <span className="text-sm text-slate-600">
          ${info.getValue().toFixed(2)}
        </span>
      ),
    }),
    columnHelper.accessor("total", {
      header: "Total",
      cell: (info) => (
        <span className="font-semibold text-slate-900">
          ${info.getValue().toFixed(2)}
        </span>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Fecha",
      cell: (info) => (
        <span className="text-sm text-slate-500">
          {new Date(info.getValue()).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: (info) => (
        <EstadoActions
          pedido={info.row.original}
          onCancelarClick={onCancelarClick}
        />
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
                No hay pedidos
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
