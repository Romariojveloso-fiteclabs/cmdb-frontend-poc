import { guideFiles, resolveImageUrls, resolveMarkdownLinks } from "./files";
import { renderMarkdown, guideIdFromDocument } from "./utils";

export function parseAllGuidesFromMarkdown() {
  const guides: { pt: any[]; en: any[] } = { pt: [], en: [] };

  for (const path in guideFiles) {
    const rawText = guideFiles[path];
    const isPt =
      path.toLowerCase().includes("pt-br") ||
      path.toLowerCase().includes("-pt.");

    const firstLine =
      rawText.split("\n").find((l) => l.startsWith("# ")) || "# Lab Guide";
    const title = firstLine.replace("# ", "").trim();

    const id = guideIdFromDocument(path, rawText);

    const htmlContent = renderMarkdown(resolveMarkdownLinks(resolveImageUrls(rawText, path), path));

    const item = {
      id,
      title,
      desc: rawText.slice(0, 150).replace(/[#\*\_]/g, "") + "...",
      level: isPt ? "Essencial" : "Essential",
      severity: "info",
      lang: isPt ? "PT-BR" : "EN",
      updated: "2026-09",
      content: rawText,
      htmlContent,
    };

    if (isPt) {
      guides.pt.push(item);
    } else {
      guides.en.push(item);
    }
  }

  return guides;
}
