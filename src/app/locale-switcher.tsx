"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { routing, Link, usePathname, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

// A menu button, not a <select>: a select that navigates on change switches pages as soon as
// a keyboard user arrows through it (WCAG 3.2.2). Items are reached with arrow keys, because
// macOS browsers leave links out of the Tab order by default.
export default function LocaleSwitcher({ ariaLabel }: { ariaLabel: string }) {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const query = Object.fromEntries(useSearchParams());
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pendingFocus = useRef<number | null>(null);
  const menuId = useId();
  const currentIndex = routing.locales.indexOf(currentLocale);

  const openAndFocus = (index: number) => {
    if (open) return itemRefs.current[index]?.focus();
    pendingFocus.current = index;
    setOpen(true);
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const n = routing.locales.length;
    const i = itemRefs.current.indexOf(document.activeElement as HTMLAnchorElement);
    const next = (
      { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: n - 1 } as Record<string, number>
    )[e.key];
    if (next === undefined) return;
    e.preventDefault();
    itemRefs.current[(next + n) % n]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    if (pendingFocus.current !== null) {
      itemRefs.current[pendingFocus.current]?.focus();
      pendingFocus.current = null;
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative ml-1 pl-1 border-l border-zinc-800 flex items-center"
      // Null relatedTarget is a click (Safari doesn't focus clicked links); pointerdown handles those.
      onBlur={(e) => {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        // detail === 0: Enter/Space, so focus moves into the menu; a mouse click only opens it.
        onClick={(e) => {
          if (open) setOpen(false);
          else if (e.detail === 0) openAndFocus(currentIndex);
          else setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
          e.preventDefault();
          openAndFocus(currentIndex);
        }}
        className="flex items-center gap-1.5 px-1.5 py-1.5 pointer-coarse:min-h-11 text-xs font-medium text-zinc-400 hover:text-zinc-100 cursor-pointer rounded-lg hover:bg-zinc-800/60 transition-colors"
      >
        {/* Inside the button so tapping the icon opens the menu too. */}
        <Languages className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden />
        <span className="sr-only">{ariaLabel}: </span>
        {localeLabels[currentLocale]}
        <ChevronDown
          className={`w-3 h-3 text-zinc-500 motion-safe:transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-full mt-2 min-w-28 py-1 rounded-lg border border-zinc-800 bg-zinc-900 shadow-lg shadow-black/40"
        >
          {routing.locales.map((loc, i) => (
            <li key={loc} role="none">
              <Link
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                href={{ pathname, query }}
                locale={loc}
                replace
                lang={loc}
                hrefLang={loc}
                aria-current={loc === currentLocale ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block px-3 py-1.5 pointer-coarse:py-3.5 text-xs transition-colors hover:bg-zinc-800/60 hover:text-zinc-100 -outline-offset-2 ${
                  loc === currentLocale ? "text-zinc-100 font-semibold" : "text-zinc-400"
                }`}
              >
                {localeLabels[loc]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
