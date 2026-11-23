import { PAGE_SIZE, Page, CardGrid, CardSkeleton } from "../ui";

export default function DealMeterLoading() {
  return (
    <Page>
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 motion-safe:animate-pulse">
        <div className="h-9 pointer-coarse:h-11 w-full max-w-xs border border-zinc-800 rounded-lg" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 pointer-coarse:w-11 pointer-coarse:h-11 border border-zinc-800 rounded-lg" />
          <div className="h-4 w-14 bg-zinc-800 rounded" />
          <div className="w-9 h-9 pointer-coarse:w-11 pointer-coarse:h-11 border border-zinc-800 rounded-lg" />
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
