import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");
  return (
    <main className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-5xl font-black text-zinc-700 mb-4">404</p>
      <p className="text-zinc-500 mb-6">{t("title")}</p>
      <Link
        href="/"
        className="text-[#b9d9fb] hover:text-[#d0e5fd] text-sm transition-colors"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
