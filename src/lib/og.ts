export function parseFontFaces(css: string) {
  return [
    ...css.matchAll(/font-weight: (\d+);\s*src: url\((.+?)\) format\('(?:truetype|opentype)'\)/g),
  ].map(([, weight, url]) => ({ weight: Number(weight), url }));
}

/** Largest px size in [min, max] at which `text` fits `width`, from rough Noto Sans KR bold advances (10% margin: they run ~2% low). */
export function fitFontSize(text: string, width: number, max: number, min: number) {
  const em = (c: string) =>
    c > "~" ? 0.92 : /[mwMW]/.test(c) ? 0.9 : /[A-Z0-9]/.test(c) ? 0.72 : 0.6;
  const ems = [...text].reduce((sum, c) => sum + em(c), 0);
  return Math.max(min, Math.min(max, Math.floor((width * 0.9) / ems)));
}

/** Noto Sans KR cut to `text` (team names can be Hangul); [] on failure, so next/og falls back to its default font. */
export async function loadFonts(text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;800&text=${encodeURIComponent(text)}`,
    );
    return await Promise.all(
      parseFontFaces(await css.text()).map(async ({ weight, url }) => {
        const font = await fetch(url);
        if (!font.ok) throw new Error(`font ${font.status}`); // an error page would crash satori
        return {
          name: "Noto Sans KR",
          data: await font.arrayBuffer(),
          weight: weight as 400 | 800,
          style: "normal" as const,
        };
      }),
    );
  } catch (e) {
    console.error("og font load failed", e);
    return [];
  }
}
