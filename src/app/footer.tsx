export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 text-zinc-500 text-sm">
        <p>
          Copyright 2022-{new Date().getFullYear()} 플래닛네트워크. All rights
          reserved.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center">
          <span>PlanetEarth is not affiliated with Mojang or Microsoft.</span>
          <span>Help: contact@planetearth.kr</span>
        </div>
      </div>
    </footer>
  );
}
