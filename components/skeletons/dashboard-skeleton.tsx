// src/components/skeletons/dashboard-skeleton.tsx
export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 flex items-start justify-between"
          >
            <div className="space-y-3 flex-1">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-8 bg-gray-200 rounded w-16" />
              <div className="h-2 bg-gray-200 rounded w-32" />
            </div>
            <div className="h-11 w-11 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-2 bg-gray-200 rounded w-32" />
              </div>
            </div>
            <div className="h-4 w-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
