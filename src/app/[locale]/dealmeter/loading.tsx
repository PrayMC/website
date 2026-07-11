export default function DealMeterLoading() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 sm:p-8 animate-pulse"
          >
            <div className="flex items-center">
              <div className="flex-1 min-w-0 text-right pr-3 sm:pr-6">
                <div className="h-5 w-full max-w-24 bg-zinc-800 rounded ml-auto mb-2" />
                <div className="h-9 w-12 bg-zinc-800 rounded ml-auto" />
              </div>
              <div className="px-3 sm:px-6 shrink-0 flex flex-col items-center">
                <div className="h-5 w-5 bg-zinc-800 rounded" />
                <div className="h-3 w-16 bg-zinc-800 rounded mt-2" />
              </div>
              <div className="flex-1 min-w-0 pl-3 sm:pl-6">
                <div className="h-5 w-full max-w-24 bg-zinc-800 rounded mb-2" />
                <div className="h-9 w-12 bg-zinc-800 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
              <div className="h-3 w-20 bg-zinc-800 rounded" />
              <div className="h-3 w-32 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
