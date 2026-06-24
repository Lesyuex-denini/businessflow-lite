// src/components/skeletons/history-skeleton.tsx
export function HistorySkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-56" />
        </div>
        <div className="h-9 bg-gray-200 rounded w-32" />
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 space-y-2"
          >
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-7 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-50"
          >
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
