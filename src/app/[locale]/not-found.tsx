import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  return (
    <main className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-5xl font-black text-zinc-500 mb-4">404</p>
      <h1 className="text-muted mb-6">{t("title")}</h1>
      <Link
        href="/"
        className="inline-block pointer-coarse:py-3 text-brand hover:text-brand-hover text-sm transition-colors"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
