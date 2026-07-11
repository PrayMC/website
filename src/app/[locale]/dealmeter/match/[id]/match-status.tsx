import { ArrowLeft, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function MatchStatus({
  messageKey,
}: {
  messageKey: "matchNotFound" | "loadError";
}) {
  const t = await getTranslations("dealmeter");
  return (
    <main className="max-w-6xl mx-auto px-4 py-24 text-center font-sans">
      <Shield className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
      <p className="text-zinc-500 text-lg">{t(messageKey)}</p>
      <Link
        href="/dealmeter"
        className="inline-flex items-center gap-1.5 text-[#b9d9fb] hover:text-[#d0e5fd] mt-4 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToList")}
      </Link>
    </main>
  );
}
