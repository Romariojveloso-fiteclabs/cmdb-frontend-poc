import { marked } from "marked";
import { Lang } from "../families";
import { DynamicEvidence } from "./types";

function cleanHeadingText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[\*_`~]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function createHeadingId(value: string): string {
  return cleanHeadingText(value)
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function addHeadingIds(html: string): string {
  const usedIds = new Map<string, number>();

  return html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (heading, level, attributes, content) => {
      if (/\sid=["'][^"']+["']/.test(attributes)) return heading;

      const baseId = createHeadingId(content) || `section-${usedIds.size + 1}`;
      const occurrence = usedIds.get(baseId) || 0;
      const id = occurrence === 0 ? baseId : `${baseId}-${occurrence}`;
      usedIds.set(baseId, occurrence + 1);

      return `<h${level}${attributes} id="${id}">${content}</h${level}>`;
    },
  );
}

function makeImagesZoomable(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (_image, attributes: string) => {
    let nextAttributes = attributes;
    if (/\sclass=["'][^"']*["']/.test(nextAttributes)) {
      nextAttributes = nextAttributes.replace(
        /\sclass=(["'])([^"']*)\1/,
        (_className, quote, classes) => ` class=${quote}${classes} markdown-evidence-image${quote}`,
      );
    } else {
      nextAttributes += ' class="markdown-evidence-image"';
    }
    if (!/\stabindex=/.test(nextAttributes)) nextAttributes += ' tabindex="0"';
    if (!/\srole=/.test(nextAttributes)) nextAttributes += ' role="button"';
    return `<img${nextAttributes}>`;
  });
}

export function renderMarkdown(markdownText: string): string {
  return makeImagesZoomable(addHeadingIds(marked.parse(markdownText) as string));
}

export function normalizeContentPath(path: string): string {
  const parts: string[] = [];

  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }

  return `/${parts.join("/")}`;
}
export function extractToc(markdownText: string) {
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const toc: { id: string; n: string; label: string }[] = [];
  let match;
  let count = 1;

  while ((match = headingRegex.exec(markdownText)) !== null) {
    const rawLabel = match[1].trim();
    const cleanLabel = cleanHeadingText(rawLabel);
    const id = createHeadingId(rawLabel);
    const num = String(count).padStart(2, "0");
    toc.push({ id, n: num, label: cleanLabel });
    count++;
  }

  return toc;
}

export function extractSummary(markdownText: string, lang: Lang): string {
  const patterns = [
    /##\s*1\.\s*(?:Resumo|Abstract|Summary|Summary)[^\n]*\n+([\s\S]*?)(?=\n##|\n#|$)/i,
    /##\s*(?:Resumo|Abstract|Summary|Summary|O que é o [^\n?]+)[^\n]*\n+([\s\S]*?)(?=\n##|\n#|$)/i,
    /###\s*(?:Resumo|Abstract|Summary)[^\n]*\n+([\s\S]*?)(?=\n###|\n##|\n#|$)/i,
  ];

  for (const regex of patterns) {
    const match = markdownText.match(regex);
    if (match && match[1]) {
      const clean = match[1]
        .replace(/^[>|\*\-\s]+/gm, "")
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/<img.*?>/gi, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim();
      if (clean.length > 20) {
        return clean;
      }
    }
  }

  const lines = markdownText.split("\n");
  const paragraphs: string[] = [];
  let currentP = "";

  for (const line of lines) {
    const l = line.trim();
    if (
      l.startsWith("#") ||
      l.startsWith("|") ||
      l.startsWith(">") ||
      l.startsWith("-") ||
      l.startsWith("*")
    ) {
      if (currentP.length > 40) {
        paragraphs.push(currentP.trim());
        currentP = "";
      }
    } else if (l.length > 0) {
      currentP += " " + l;
    } else {
      if (currentP.length > 40) {
        paragraphs.push(currentP.trim());
        currentP = "";
      }
    }
  }
  if (currentP.length > 40) paragraphs.push(currentP.trim());

  const validP = paragraphs.find(
    (p) =>
      !p.toLowerCase().includes("aviso") &&
      !p.toLowerCase().includes("notice") &&
      !p.toLowerCase().includes("universidade") &&
      !p.toLowerCase().includes("federal university"),
  );

  return (
    validP ||
    (lang === "pt"
      ? "Resumo extraído da documentação técnica do estudo."
      : "Summary extracted from study technical documentation.")
  );
}

export function extractAuthors(rawText: string): string {
  const match = rawText.match(/\|\s*(?:Autor(?:es)?\s+respons[aá]vel|Responsible\s+author)\s*\|\s*([^|]+?)\s*\|/i);
  return match ? match[1].trim() : "";
}

export function extractSignatures(rawText: string): { role: string; name: string }[] {
  const lines = rawText.split("\n");
  const headerIndex = lines.findIndex((l) => /^\|\s*(?:Papel|Role)\s*\|\s*Nome\s*\|/i.test(l) || /^\|\s*Role\s*\|\s*Name\s*\|/i.test(l));
  if (headerIndex === -1) return [];

  const signatures: { role: string; name: string }[] = [];
  for (let i = headerIndex + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim().startsWith("|")) break;

    const cells = line.split("|").map((c) => c.trim());
    const role = cells[1];
    const name = cells[2];
    if (!role) break;

    signatures.push({ role, name: name || "" });
  }

  return signatures;
}

export function extractEvidencesFromMarkdown(
  markdownText: string,
  familyKey: string,
): DynamicEvidence[] {
  const evidences: DynamicEvidence[] = [];
  let figCount = 1;

  const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdImgRegex.exec(markdownText)) !== null && figCount <= 12) {
    const altText = match[1] || `Figura ${figCount}`;
    const imgSrc = match[2].trim();

    if (!evidences.some((e) => e.imgUrl === imgSrc)) {
      evidences.push({
        title: altText,
        desc: `Evidência de laboratório ${figCount} capturada durante o experimento da família ${familyKey.toUpperCase()}.`,
        imgUrl: imgSrc,
        figNum: `FIG. ${String(figCount).padStart(2, "0")}`,
      });
      figCount++;
    }
  }

  const htmlImgRegex = /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  while ((match = htmlImgRegex.exec(markdownText)) !== null && figCount <= 12) {
    const altMatch = match[0].match(/alt=["']([^"']+)["']/i);
    const altText = altMatch ? altMatch[1] : `Figura ${figCount}`;
    const imgSrc = match[2].trim();

    if (!evidences.some((e) => e.imgUrl === imgSrc)) {
      evidences.push({
        title: altText,
        desc: `Evidência de laboratório ${figCount} capturada durante o experimento da família ${familyKey.toUpperCase()}.`,
        imgUrl: imgSrc,
        figNum: `FIG. ${String(figCount).padStart(2, "0")}`,
      });
      figCount++;
    }
  }

  return evidences;
}

export function splitBiLangMarkdown(rawContent: string): { pt: string; en: string } {
  if (rawContent.includes("### **PT**") && rawContent.includes("### **EN**")) {
    const parts = rawContent.split(/###\s*\*\*EN\*\*/i);
    const ptPart = parts[0].replace(/###\s*\*\*PT\*\*/i, "").trim();
    const enPart = parts[1] ? parts[1].trim() : ptPart;
    return { pt: ptPart, en: enPart };
  }
  return { pt: rawContent, en: rawContent };
}

export function markdownTitle(rawText: string, fallback: string): string {
  const firstHeading = rawText.split("\n").find((line) => line.startsWith("# "));
  return firstHeading?.replace(/^#\s+/, "").trim() || fallback;
}

export function guideIdFromDocument(path: string, rawText: string): string {
  const guideIdMatch = rawText.match(/CMDB-GD-\d{3}/i) || path.match(/CMDB-GD-\d{3}/i);
  if (guideIdMatch) return guideIdMatch[0].toUpperCase();

  const guideFileName = path.split("/").pop()?.replace(/\.md$/i, "") || "guide";
  return guideFileName
    .replace(/-(?:pt-br|en)$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

export function reportIdFromDocument(path: string, rawText: string): string {
  const declaredId = rawText.match(/^id:\s*(CMDB-[A-Z0-9-]+)/im)?.[1];
  const numberedId = rawText.match(/\bCMDB-(?:TR|PR)-\d{3}\b/i)?.[0]
    || path.match(/\bCMDB-(?:TR|PR)-\d{3}\b/i)?.[0];
  if (declaredId || numberedId) return (declaredId || numberedId)!.toUpperCase();

  const fileName = path.split("/").pop()?.replace(/\.md$/i, "") || "report";
  return fileName
    .replace(/-(?:pt-br|en)$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}
