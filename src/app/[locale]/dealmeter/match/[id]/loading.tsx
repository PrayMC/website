export default function MatchDetailLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 animate-pulse">
      <div className="h-4 w-16 bg-zinc-800 rounded mb-6 sm:mb-8" />

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-10 mb-4 sm:mb-6">
        <div className="flex justify-center gap-2.5 mb-5 sm:mb-8">
          <div className="h-4 w-16 bg-zinc-800 rounded" />
          <div className="h-4 w-32 bg-zinc-800 rounded" />
          <div className="h-4 w-20 bg-zinc-800 rounded" />
        </div>
        <div className="flex items-center">
          <div className="flex-1 min-w-0 text-right">
            <div className="h-7 w-full max-w-32 bg-zinc-800 rounded ml-auto mb-2" />
          </div>
          <div className="px-4 sm:px-12 flex items-baseline gap-3 sm:gap-5">
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-zinc-800 rounded" />
            <div className="h-5 w-3 bg-zinc-800 rounded" />
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-zinc-800 rounded" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-7 w-full max-w-32 bg-zinc-800 rounded mb-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
          >
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-800">
              <div className="h-5 w-28 bg-zinc-800 rounded" />
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-10 bg-zinc-800/50 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
