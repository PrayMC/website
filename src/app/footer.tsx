export default function Footer() {
  const year = new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", year: "numeric" }).format();
  return (
    <footer className="border-t border-zinc-800 py-6 mt-8">
      <div className="page-frame flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 text-muted text-sm">
        <p>Copyright 2022-{year} 플래닛네트워크. All rights reserved.</p>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center">
          <span>PlanetEarth is not affiliated with Mojang or Microsoft.</span>
          <span>Help: contact@planetearth.kr</span>
        </div>
      </div>
    </footer>
  );
}
