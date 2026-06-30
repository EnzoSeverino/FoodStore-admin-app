interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'default'
    isLoading?: boolean
}

const confirmStyles = {
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    default: 'bg-slate-900 text-white hover:bg-slate-800',
}

const confirmIcons = {
    danger: '⚠',
    warning: '⚠',
    default: '❓',
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'default',
    isLoading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose() }}
        >
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{confirmIcons[variant]}</span>
                        <h2 
                            id="confirm-title" 
                            className="text-lg font-bold text-slate-900"
                            >
                                {title}
                        </h2>
                    </div>
                    <p
                        id="confirm-message"
                        className="mb-6 text-sm text-slate-600"
                    >
                        {message}
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors ${confirmStyles[variant]}`}
                            >
                                {isLoading ? 'Procesando...' : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}