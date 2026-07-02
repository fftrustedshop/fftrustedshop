export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Video placeholder */}
      <div className="w-full h-52 animate-shimmer" />

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 rounded-lg animate-shimmer" />
        {/* Badge */}
        <div className="h-4 w-1/3 rounded-full animate-shimmer" />

        {/* Price */}
        <div className="flex gap-3 mt-4">
          <div className="h-8 w-20 rounded-lg animate-shimmer" />
          <div className="h-6 w-16 rounded-lg animate-shimmer mt-1" />
        </div>

        {/* Features */}
        <div className="space-y-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 rounded animate-shimmer" style={{ width: `${75 - i * 10}%` }} />
          ))}
        </div>

        {/* Button */}
        <div className="h-12 w-full rounded-xl animate-shimmer mt-5" />
      </div>
    </div>
  );
}
