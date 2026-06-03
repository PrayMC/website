import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-zinc-800 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 text-zinc-500 text-sm">
        <p>
          Copyright 2022-{new Date().getFullYear()} {t("copyright")}. All
          rights reserved.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center">
          <span>{t("notAffiliated")}</span>
          <span>{t("help")}</span>
        </div>
      </div>
    </footer>
  );
}
