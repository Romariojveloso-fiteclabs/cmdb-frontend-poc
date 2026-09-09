import { templateFiles, resolveImageUrls, resolveMarkdownLinks } from "./files";
import { renderMarkdown } from "./utils";

export function parseAllTemplatesFromMarkdown() {
  const templates: { pt: any[]; en: any[] } = { pt: [], en: [] };

  for (const path in templateFiles) {
    const rawText = templateFiles[path];
    const isPt =
      path.toLowerCase().includes("pt-br") ||
      path.toLowerCase().includes("-pt.");

    const firstLine =
      rawText.split("\n").find((l) => l.startsWith("# ")) ||
      "# Report Template";
    const title = firstLine.replace("# ", "").trim();

    const tplIdMatch =
      rawText.match(/CMDB-TPL-\d{2}/i) || rawText.match(/CMDB-[A-Z0-9-]+/i);
    const id = tplIdMatch ? tplIdMatch[0].toUpperCase() : "CMDB-TPL-01";

    const item = {
      id,
      format: "Markdown (.md)",
      title,
      desc: rawText.slice(0, 140).replace(/[#\*\_]/g, "") + "...",
      fields: isPt
        ? [
            "Estrutura técnica padronizada",
            "Campos de metadados de laboratório",
          ]
        : ["Standard technical structure", "Lab metadata fields"],
      required: isPt ? "Modelo Padrão" : "Standard Template",
      href: "#",
      content: rawText,
    };

    if (isPt) {
      templates.pt.push(item);
    } else {
      templates.en.push(item);
    }
  }

  return templates;
}
