// Skeleton Job Card Component
const SkeletonJobCard = () => (
  <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6 animate-pulse">
    <div className="flex items-start mb-4">
      <div className="w-12 h-12 rounded-full bg-cyan-100/50 flex-shrink-0 mr-3" />
      <div className="flex-1">
        <div className="h-4 bg-cyan-100/50 rounded w-3/4 mb-2" />
        <div className="h-3 bg-cyan-100/50 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-3">
      <div className="flex items-center">
        <div className="h-3 bg-cyan-100/50 rounded w-1/4" />
      </div>
      <div className="flex items-center">
        <div className="h-3 bg-cyan-100/50 rounded w-1/3" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-cyan-100/50 rounded w-full" />
      <div className="h-3 bg-cyan-100/50 rounded w-5/6" />
      <div className="h-3 bg-cyan-100/50 rounded w-4/6" />
    </div>
  </div>
);

// Skeleton Grid Component
export default function SkeletonGrid({ count = 5 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonJobCard key={i} />
      ))}
    </div>
  );
}
