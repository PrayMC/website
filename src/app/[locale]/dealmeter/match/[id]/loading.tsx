import { Page, BackLinkSkeleton } from "../../ui";

export default function MatchDetailLoading() {
  return (
    <Page>
      <div className="motion-safe:animate-pulse">
        <div className="mb-6 sm:mb-8">
          <BackLinkSkeleton />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-10 mb-4 sm:mb-6">
          {/* Bar widths are the ko items' widths, so the row wraps where the real one does on phones. */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 sm:gap-2.5 mb-5 sm:mb-8">
            <div className="h-4 sm:h-5 w-23 sm:w-26 bg-zinc-800 rounded" />
            <div className="h-4 sm:h-5 w-52.5 sm:w-60 bg-zinc-800 rounded" />
            <div className="h-4 sm:h-5 w-17.5 sm:w-20 bg-zinc-800 rounded" />
            <div className="h-4 sm:h-5 w-13 sm:w-14.5 bg-zinc-800 rounded" />
          </div>
          {/* Mirrors the hero: one team per row below lg. */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 lg:hidden">
            <div className="h-6 sm:h-8 w-32 sm:w-48 bg-zinc-800 rounded" />
            <div className="h-9 sm:h-15 w-7 sm:w-10 bg-zinc-800 rounded" />
            <div className="h-6 sm:h-8 w-28 sm:w-40 bg-zinc-800 rounded" />
            <div className="h-9 sm:h-15 w-7 sm:w-10 bg-zinc-800 rounded" />
          </div>
          <div className="hidden lg:flex items-center">
            <div className="flex-1 min-w-0 text-right">
              <div className="h-7 w-full max-w-32 bg-zinc-800 rounded ml-auto mb-2" />
            </div>
            <div className="px-4 sm:px-12 flex items-center gap-3 sm:gap-5">
              <div className="h-15 w-16 bg-zinc-800 rounded" />
              <div className="h-5 w-3 bg-zinc-800 rounded" />
              <div className="h-15 w-16 bg-zinc-800 rounded" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-7 w-full max-w-32 bg-zinc-800 rounded mb-2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-800">
                <div className="h-5 my-0.5 sm:my-1 w-28 bg-zinc-800 rounded" />
              </div>
              {/* TeamPanel's row boxes: stat header, then 7 players (the most common team size). */}
              <div className="h-10 sm:h-11.5 box-content border-b border-zinc-800/50" />
              <div className="divide-y divide-zinc-800/50">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-2 sm:gap-2.5 py-2.5 sm:py-3 pl-3 sm:pl-4"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-zinc-800 rounded-md" />
                    <div className="h-3 sm:h-4 w-20 bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
          <div className="h-4 sm:h-5 w-32 bg-zinc-800 rounded mx-auto mb-4 sm:mb-6" />
          {/* Timeline rows: time, then the event card (2 lines on phones); 3 is the median kill count. */}
          <div className="pl-5 sm:pl-6 space-y-2.5 sm:space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 sm:gap-4">
                <div className="h-3 w-10 sm:w-12 shrink-0 bg-zinc-800 rounded" />
                <div className="flex-1 h-16.5 sm:h-12.5 bg-zinc-800/50 border border-zinc-800 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
