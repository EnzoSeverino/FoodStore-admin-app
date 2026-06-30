type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
    variant?: BadgeVariant
    children?: React.ReactNode
    className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
}

export function Badge({
    variant = 'default',
    children,
    className = '',
}: BadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    )
}

import type { CodigoEstado } from "@/types/pedido"

// eslint-disable-next-line react-refresh/only-export-components
export function getEstadoBadgeVariant(estado: CodigoEstado): BadgeVariant {
    const map: Record<CodigoEstado, BadgeVariant> = {
        PENDIENTE: 'warning',
        CONFIRMADO: 'info',
        EN_PREP: 'warning',
        ENTREGADO: 'success',
        CANCELADO: 'danger',
    }
    return map[estado]
}
