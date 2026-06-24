// src/components/skeletons/products-skeleton.tsx
export function ProductsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
        <div className="h-9 bg-gray-200 rounded w-32" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded" />
          ))}
        </div>

        {/* Table Rows */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-50"
          >
            <div className="h-4 bg-gray-200 rounded col-span-1" />
            <div className="h-4 bg-gray-100 rounded col-span-1" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-8" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="flex justify-end gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
