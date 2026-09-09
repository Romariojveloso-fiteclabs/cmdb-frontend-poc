import { Lang } from "../families";
import { generalFiles, resolveMarkdownLinks } from "./files";
import { renderMarkdown } from "./utils";

export function parseGeneralDocFromMarkdown(
  docType: "disclaimer" | "security" | "contributing",
  lang: Lang,
) {
  const matchesLang = (lowerPath: string) =>
    (lang === "pt" && lowerPath.includes("pt-br")) || (lang === "en" && !lowerPath.includes("pt-br"));

  for (const path in generalFiles) {
    const lowerPath = path.toLowerCase();
    if (lowerPath.includes(docType) && matchesLang(lowerPath)) {
      const rawText = generalFiles[path];
      return { rawText, htmlContent: renderMarkdown(resolveMarkdownLinks(rawText, path)) };
    }
  }

  for (const path in generalFiles) {
    const lowerPath = path.toLowerCase();
    if (lowerPath.includes(docType)) {
      const rawText = generalFiles[path];
      return { rawText, htmlContent: renderMarkdown(resolveMarkdownLinks(rawText, path)) };
    }
  }

  return null;
}
