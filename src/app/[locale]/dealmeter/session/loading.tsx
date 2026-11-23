import { Page, CardGrid, CardSkeleton, BackLinkSkeleton } from "../ui";

export default function SessionLoading() {
  return (
    <Page>
      <div className="motion-safe:animate-pulse">
        <div className="mb-6 sm:mb-8">
          <BackLinkSkeleton />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-10 mb-8 sm:mb-10">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 sm:gap-2.5 mb-5 sm:mb-8">
            <div className="h-4 sm:h-5 w-12 bg-zinc-800 rounded" />
            <div className="h-4 sm:h-5 w-56 bg-zinc-800 rounded" />
            <div className="h-4 sm:h-5 w-24 bg-zinc-800 rounded" />
            <div className="h-4 sm:h-5 w-24 bg-zinc-800 rounded" />
          </div>
          <div className="@container">
            <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 @xs:hidden">
              <div className="h-5 w-24 bg-zinc-800 rounded" />
              <div className="h-9 w-7 bg-zinc-800 rounded" />
              <div className="h-5 w-20 bg-zinc-800 rounded" />
              <div className="h-9 w-7 bg-zinc-800 rounded" />
            </div>
            <div className="hidden @xs:flex items-center gap-4">
              <div className="flex-1 flex justify-end">
                <div className="h-5 w-24 bg-zinc-800 rounded" />
              </div>
              <div className="h-9 sm:h-12 w-24 sm:w-28 bg-zinc-800 rounded" />
              <div className="flex-1">
                <div className="h-5 w-24 bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardGrid>
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </CardGrid>
    </Page>
  );
}
