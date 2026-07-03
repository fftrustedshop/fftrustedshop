export default function SkeletonCard() {
  return (
    <div className="card-white">
      {/* Ribbon */}
      <div className="h-9 animate-shimmer" style={{ borderRadius: "0" }} />
      {/* Image */}
      <div className="w-full animate-shimmer" style={{ aspectRatio: "16/9" }} />
      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full animate-shimmer" />
          <div className="h-6 w-16 rounded-full animate-shimmer" />
        </div>
        <div className="h-4 w-3/4 rounded animate-shimmer" />
        <div className="h-4 w-1/2 rounded animate-shimmer" />
        <div className="h-12 w-full rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}
