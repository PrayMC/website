import { SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { StatusMessage } from "../../ui";

export default async function MatchNotFound() {
  const t = await getTranslations("dealmeter");
  return <StatusMessage icon={SearchX} message={t("matchNotFound")} backLabel={t("backToList")} />;
}
