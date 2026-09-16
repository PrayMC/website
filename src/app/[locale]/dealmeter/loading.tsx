import { PAGE_SIZE, Page, CardGrid } from "./ui";

function CardSkeleton() {
  return (
    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex justify-end">
          <div className="h-4 w-20 bg-zinc-800 rounded" />
        </div>
        <div className="h-6 w-14 bg-zinc-800 rounded" />
        <div className="flex-1">
          <div className="h-4 w-20 bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-zinc-800/70">
        <div className="h-3 w-28 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export default function DealMeterLoading() {
  return (
    <Page>
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 animate-pulse">
        <div className="h-9 w-full max-w-xs border border-zinc-800 rounded-md" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 border border-zinc-800 rounded-md" />
          <div className="h-4 w-14 bg-zinc-800 rounded" />
          <div className="w-9 h-9 border border-zinc-800 rounded-md" />
        </div>
      </div>
      <CardGrid>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </CardGrid>
    </Page>
  );
}
