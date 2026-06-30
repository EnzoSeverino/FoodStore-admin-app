interface SkeletonLoaderProps {
    className?: string
}

export function SkeletonLoader({ className = 'h-4 w-full' }: SkeletonLoaderProps) {
    return (
        <div
            className={`animate-pulse rounded bg-slate-200 ${className}`}
            aria-hidden="true"
        />
    )
}

interface SkeletonTableProps {
    rows?: number
    columns?: number
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5">
                <div className="flex gap-8">
                    {Array.from({ length: columns }).map((_, i) => (
                        <SkeletonLoader key={i} className="h-3 w-24" />
                    ))}
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-8 px-5 py-4">
                        {Array.from({ length: columns }).map((_, colIdx) => (
                            <SkeletonLoader key={colIdx} className="h-4 w-24" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export function SkeletonCard() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <SkeletonLoader className="h-3 w-20 mb-3" />
            <SkeletonLoader className="h-8 w-16 mb-2" />
            <SkeletonLoader className="h-3 w-28" />
        </div>
    )
}