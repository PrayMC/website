"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, BarChart3 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Pray"
              width={36}
              height={36}
              loading="eager"
              className="w-9 h-9 shrink-0"
            />
            <span className="text-lg font-extrabold text-[#b9d9fb]">
              Pray
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <NavLink href="/dealmeter" icon={<BarChart3 className="w-4 h-4" />} label="매치 기록" badge="Beta" active={pathname.startsWith("/dealmeter")} />
            <NavLink href="https://discord.gg/aTCD3aXPND" icon={<Gamepad2 className="w-4 h-4" />} label="디스코드" external />
          </div>
        </div>
      </div>
      <div className="h-px pray-gradient-border opacity-20" />
    </nav>
  );
}

function NavLink({ href, icon, label, external, badge, active }: { href: string; icon: React.ReactNode; label: string; external?: boolean; badge?: string; active?: boolean }) {
  const cls = `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
    active
      ? "text-zinc-100 bg-zinc-800/80"
      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
  }`;
  const inner = (
    <>
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge && (
        <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider text-[#b9d9fb] bg-[#b9d9fb]/10 px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
    </>
  );
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  }
  return <Link href={href} className={cls}>{inner}</Link>;
}
