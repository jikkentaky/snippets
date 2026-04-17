export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 border-l-4 border-l-zinc-700 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="h-4 bg-zinc-800 rounded w-2/5" />
        <div className="h-5 bg-zinc-800 rounded-full w-20 shrink-0" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-4/5" />
        <div className="h-3 bg-zinc-800 rounded w-3/5" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="h-4 bg-zinc-800 rounded-full w-14" />
          <div className="h-4 bg-zinc-800 rounded-full w-10" />
        </div>
        <div className="h-3 bg-zinc-800 rounded w-16" />
      </div>
    </div>
  );
}
