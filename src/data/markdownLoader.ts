import { marked } from "marked";
import { Lang } from "./families";
import { withBase } from "../utils/paths";

export interface DynamicSample {
  id: string;
  sha: string;
  verifyLabel: string;
  verifySeverity: "success" | "warning" | "secondary" | "info" | "danger";
  fields: { label: string; value: string }[];
  provenance: string;
}

export interface DynamicExperiment {
  title: string;
  date: string;
  fields: { label: string; value: string }[];
  result: string;
}

export interface DynamicEvidence {
  title: string;
  desc: string;
  imgUrl: string;
  figNum: string;
}

export interface ParsedFamilyData {
  key: string;
  name: string;
  disp: string;
  alias: string;
  aliases: string;
  authors: string;
  signatures: Record<Lang, { role: string; name: string }[]>;
  cat: string;
  headline: Record<Lang, string>;
  plats: string[];
  samplesCount: number;
  report: string;
  updated: string;
  ed: "legacy" | "draft" | "review" | "published";
  id: "declared" | "correlated" | "verified";
  ev: "untested" | "observed";
  rec: "none" | "unrec" | "inconc" | "partial" | "apparent" | "hash";
  av: "meta" | "ctrl";
  samples: Record<Lang, DynamicSample[]>;
  experiments: Record<Lang, DynamicExperiment[]>;
  evidences: Record<Lang, DynamicEvidence[]>;
  limitations: Record<Lang, string[]>;
  summary: Record<Lang, string>;
  htmlContent: Record<Lang, string>;
  toc: Record<Lang, { id: string; n: string; label: string }[]>;
}

export interface ParsedReportDocument {
  id: string;
  familyKey: string;
  title: Record<Lang, string>;
  htmlContent: Record<Lang, string>;
  toc: Record<Lang, { id: string; n: string; label: string }[]>;
}

const reportFiles = import.meta.glob("/src/content/docs/reports/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const guideFiles = import.meta.glob("/src/content/docs/guides/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const templateFiles = import.meta.glob("/src/content/docs/templates/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const generalFiles = import.meta.glob("/src/content/docs/general/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const contentImageFiles = import.meta.glob(
  [
    "/src/content/docs/**/*.png",
    "/src/content/docs/**/*.jpg",
    "/src/content/docs/**/*.jpeg",
    "/src/content/docs/**/*.gif",
    "/src/content/docs/**/*.webp",
    "/src/content/docs/**/*.svg",
    "/src/content/docs/**/*.avif",
  ],
  {
    query: "?url",
    import: "default",
    eager: true,
  },
) as Record<string, string>;

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

function renderMarkdown(markdownText: string): string {
  return makeImagesZoomable(addHeadingIds(marked.parse(markdownText) as string));
}

function normalizeContentPath(path: string): string {
  const parts: string[] = [];

  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }

  return `/${parts.join("/")}`;
}

function resolveImageUrl(
  source: string,
  documentPath: string,
  familyKey?: string,
): string {
  const cleanSource = source.trim();
  if (!cleanSource || /^(?:[a-z]+:|\/\/|#)/i.test(cleanSource)) return cleanSource;

  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  if (cleanSource === base.slice(0, -1) || cleanSource.startsWith(base)) return cleanSource;

  if (!cleanSource.startsWith("/")) {
    const documentDirectory = documentPath.slice(0, documentPath.lastIndexOf("/"));
    const contentPath = normalizeContentPath(`${documentDirectory}/${cleanSource}`);
    const decodedContentPath = (() => {
      try {
        return decodeURIComponent(contentPath);
      } catch {
        return contentPath;
      }
    })();
    const importedUrl = contentImageFiles[contentPath] || contentImageFiles[decodedContentPath];
    if (importedUrl) return importedUrl;
  }

  if (familyKey && /(?:^|\/)img\//.test(cleanSource)) {
    const fileName = cleanSource.split("/img/").pop() || cleanSource.replace(/^\.?\/?img\//, "");
    return withBase(`/reports/${familyKey}/img/${fileName}`);
  }

  return cleanSource.startsWith("/") ? withBase(cleanSource) : cleanSource;
}

function resolveImageUrls(
  markdownText: string,
  documentPath: string,
  familyKey?: string,
): string {
  let text = markdownText.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      return `![${alt}](${resolveImageUrl(src, documentPath, familyKey)})`;
    },
  );

  text = text.replace(
    /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi,
    (match, before, src, after) => {
      return `<img ${before}src="${resolveImageUrl(src, documentPath, familyKey)}"${after}>`;
    },
  );

  return text;
}

const markdownLinkRegistry: Record<string, string> = {};

function registerMarkdownLinkTargets(): void {
  for (const path in guideFiles) {
    const id = guideIdFromDocument(path, guideFiles[path]);
    markdownLinkRegistry[path] = withBase(`/guias/${id.toLowerCase()}/`);
  }

  for (const path in reportFiles) {
    const pathParts = path.split("/");
    const familyKey = pathParts[pathParts.length - 2].toLowerCase();
    const reportId = reportIdFromDocument(path, reportFiles[path]);
    markdownLinkRegistry[path] = withBase(
      `/familias/${familyKey}/relatorios/${reportId.toLowerCase()}/`,
    );
  }

  for (const path in templateFiles) {
    markdownLinkRegistry[path] = withBase("/modelos/");
  }

  for (const path in generalFiles) {
    const lowerPath = path.toLowerCase();
    if (lowerPath.includes("disclaimer")) markdownLinkRegistry[path] = withBase("/seguranca/#disclaimer");
    else if (lowerPath.includes("security")) markdownLinkRegistry[path] = withBase("/seguranca/#security");
    else if (lowerPath.includes("contributing")) markdownLinkRegistry[path] = withBase("/contribuir/");
  }
}

function resolveMarkdownLink(href: string, documentPath: string): string | null {
  const cleanHref = href.trim().split(/[?#]/)[0];
  if (!/\.md$/i.test(cleanHref)) return null;
  if (/^(?:[a-z]+:|\/\/)/i.test(cleanHref)) return null;

  const documentDirectory = documentPath.slice(0, documentPath.lastIndexOf("/"));
  const contentPath = normalizeContentPath(`${documentDirectory}/${cleanHref}`);
  const decodedContentPath = (() => {
    try {
      return decodeURIComponent(contentPath);
    } catch {
      return contentPath;
    }
  })();

  return markdownLinkRegistry[contentPath] || markdownLinkRegistry[decodedContentPath] || null;
}

function resolveMarkdownLinks(markdownText: string, documentPath: string): string {
  return markdownText.replace(
    /(^|[^!])\[([^\]]*)\]\(([^)]+)\)/g,
    (match, prefix, text, href) => {
      const resolved = resolveMarkdownLink(href, documentPath);
      if (resolved) return `${prefix}[${text}](${resolved})`;

      const cleanHref = href.trim().split(/[?#]/)[0];
      if (/\.md$/i.test(cleanHref) && !/^(?:[a-z]+:|\/\/)/i.test(cleanHref)) {
        return `${prefix}${text}`;
      }

      return match;
    },
  );
}

registerMarkdownLinkTargets();

function extractToc(markdownText: string) {
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

function extractSummary(markdownText: string, lang: Lang): string {
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

function extractAuthors(rawText: string): string {
  const match = rawText.match(/\|\s*(?:Autor(?:es)?\s+respons[aá]vel|Responsible\s+author)\s*\|\s*([^|]+?)\s*\|/i);
  return match ? match[1].trim() : "";
}

function extractSignatures(rawText: string): { role: string; name: string }[] {
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

function extractEvidencesFromMarkdown(
  markdownText: string,
  familyKey: string,
): DynamicEvidence[] {
  const evidences: DynamicEvidence[] = [];
  let figCount = 1;

  const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdImgRegex.exec(markdownText)) !== null && figCount <= 12) {
    const altText = match[1] || `Figura ${figCount}`;
    let imgSrc = match[2].trim();
    if (imgSrc.includes("/img/")) {
      const fileName = imgSrc.split("/img/").pop();
      imgSrc = withBase(`/reports/${familyKey}/img/${fileName}`);
    } else if (imgSrc.startsWith("img/")) {
      const fileName = imgSrc.replace("img/", "");
      imgSrc = withBase(`/reports/${familyKey}/img/${fileName}`);
    }

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
    let imgSrc = match[2].trim();
    if (imgSrc.includes("/img/")) {
      const fileName = imgSrc.split("/img/").pop();
      imgSrc = withBase(`/reports/${familyKey}/img/${fileName}`);
    } else if (imgSrc.startsWith("img/")) {
      const fileName = imgSrc.replace("img/", "");
      imgSrc = withBase(`/reports/${familyKey}/img/${fileName}`);
    }

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

function splitBiLangMarkdown(rawContent: string): { pt: string; en: string } {
  if (rawContent.includes("### **PT**") && rawContent.includes("### **EN**")) {
    const parts = rawContent.split(/###\s*\*\*EN\*\*/i);
    const ptPart = parts[0].replace(/###\s*\*\*PT\*\*/i, "").trim();
    const enPart = parts[1] ? parts[1].trim() : ptPart;
    return { pt: ptPart, en: enPart };
  }
  return { pt: rawContent, en: rawContent };
}

function markdownTitle(rawText: string, fallback: string): string {
  const firstHeading = rawText.split("\n").find((line) => line.startsWith("# "));
  return firstHeading?.replace(/^#\s+/, "").trim() || fallback;
}

function guideIdFromDocument(path: string, rawText: string): string {
  const guideIdMatch = rawText.match(/CMDB-GD-\d{3}/i) || path.match(/CMDB-GD-\d{3}/i);
  if (guideIdMatch) return guideIdMatch[0].toUpperCase();

  const guideFileName = path.split("/").pop()?.replace(/\.md$/i, "") || "guide";
  return guideFileName
    .replace(/-(?:pt-br|en)$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

function reportIdFromDocument(path: string, rawText: string): string {
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

export function parseAllReportsFromMarkdown(): ParsedReportDocument[] {
  const reportMap = new Map<string, ParsedReportDocument>();

  for (const path in reportFiles) {
    const rawText = reportFiles[path];
    const pathParts = path.split("/");
    const familyKey = pathParts[pathParts.length - 2].toLowerCase();
    const lowerPath = path.toLowerCase();
    const reportId = reportIdFromDocument(path, rawText);
    const mapKey = `${familyKey}:${reportId}`;
    const existing = reportMap.get(mapKey) || {
      id: reportId,
      familyKey,
      title: { pt: reportId, en: reportId },
      htmlContent: { pt: "", en: "" },
      toc: { pt: [], en: [] },
    };

    const isPt = lowerPath.includes("pt-br") || lowerPath.includes("-pt.");
    const isEn = lowerPath.includes("-en.") || lowerPath.endsWith("en.md");
    const bilingual = !isPt && !isEn ? splitBiLangMarkdown(rawText) : null;

    const setLanguageContent = (language: Lang, content: string) => {
      const resolvedContent = resolveMarkdownLinks(resolveImageUrls(content, path, familyKey), path);
      existing.title[language] = markdownTitle(content, reportId);
      existing.htmlContent[language] = renderMarkdown(resolvedContent);
      existing.toc[language] = extractToc(content);
    };

    if (isPt) setLanguageContent("pt", rawText);
    else if (isEn) setLanguageContent("en", rawText);
    else if (bilingual) {
      setLanguageContent("pt", bilingual.pt);
      setLanguageContent("en", bilingual.en);
    }

    reportMap.set(mapKey, existing);
  }

  return Array.from(reportMap.values()).map((report) => ({
    ...report,
    title: {
      pt: report.title.pt === report.id ? report.title.en : report.title.pt,
      en: report.title.en === report.id ? report.title.pt : report.title.en,
    },
    htmlContent: {
      pt: report.htmlContent.pt || report.htmlContent.en,
      en: report.htmlContent.en || report.htmlContent.pt,
    },
    toc: {
      pt: report.toc.pt.length ? report.toc.pt : report.toc.en,
      en: report.toc.en.length ? report.toc.en : report.toc.pt,
    },
  }));
}

export function parseAllFamiliesFromMarkdown(): ParsedFamilyData[] {
  const familyMap: Record<
    string,
    {
      ptRaw?: string;
      enRaw?: string;
      ptPath?: string;
      enPath?: string;
      key: string;
    }
  > = {};

  for (const path in reportFiles) {
    const lowerPath = path.toLowerCase();
    const parts = lowerPath.split("/");
    const folderName = parts[parts.length - 2];

    if (!familyMap[folderName]) {
      familyMap[folderName] = { key: folderName };
    }

    const content = reportFiles[path];

    if (lowerPath.includes("pt-br") || lowerPath.includes("-pt.")) {
      familyMap[folderName].ptRaw = content;
      familyMap[folderName].ptPath = path;
    } else if (lowerPath.includes("-en.") || lowerPath.includes("en.md")) {
      familyMap[folderName].enRaw = content;
      familyMap[folderName].enPath = path;
    } else {
      const split = splitBiLangMarkdown(content);
      if (split.pt !== split.en) {
        familyMap[folderName].ptRaw = split.pt;
        familyMap[folderName].enRaw = split.en;
        familyMap[folderName].ptPath = path;
        familyMap[folderName].enPath = path;
      } else {
        if (!familyMap[folderName].ptRaw) {
          familyMap[folderName].ptRaw = content;
          familyMap[folderName].ptPath = path;
        }
        if (!familyMap[folderName].enRaw) {
          familyMap[folderName].enRaw = content;
          familyMap[folderName].enPath = path;
        }
      }
    }
  }

  const families: ParsedFamilyData[] = [];
  const parsedReports = parseAllReportsFromMarkdown();

  for (const key in familyMap) {
    const item = familyMap[key];
    let ptRaw = item.ptRaw || item.enRaw || "";
    let enRaw = item.enRaw || item.ptRaw || "";

    const ptPath = item.ptPath || item.enPath || "";
    const enPath = item.enPath || item.ptPath || "";
    ptRaw = resolveImageUrls(ptRaw, ptPath, key);
    enRaw = resolveImageUrls(enRaw, enPath, key);

    const firstLine =
      ptRaw.split("\n").find((l) => l.startsWith("# ")) ||
      `# ${key.toUpperCase()}`;
    const rawName = firstLine.replace("# ", "").trim();
    const name = rawName.toUpperCase();
    const disp = rawName;

    const familyReports = parsedReports.filter((report) => report.familyKey === key);
    const primaryReport = familyReports.find((report) => /^CMDB-(?:TR|PR)-\d{3}$/.test(report.id))
      || familyReports.find((report) => report.id.endsWith("-REPORT"))
      || familyReports[0];
    const reportId = primaryReport?.id || `CMDB-TR-${key.toUpperCase()}`;

    let edStatus: "legacy" | "draft" | "review" | "published" = "published";
    if (
      ptRaw.toLowerCase().includes("rascunho") ||
      enRaw.toLowerCase().includes("draft")
    )
      edStatus = "draft";
    if (
      ptRaw.toLowerCase().includes("revisão") ||
      enRaw.toLowerCase().includes("review")
    )
      edStatus = "review";
    if (
      ptRaw.toLowerCase().includes("legado") ||
      enRaw.toLowerCase().includes("legacy")
    )
      edStatus = "legacy";

    const shaMatches = Array.from(ptRaw.matchAll(/([a-f0-9]{64})/gi)).map(
      (m) => m[1],
    );
    const primarySha =
      shaMatches[0] ||
      "e4b1f2c9a7d3856b0f4e1c2a9d7b53e8f60c1a4d92b7e35f8c0a6d1b4e29f73c";

    const summaryPt = extractSummary(ptRaw, "pt");
    const summaryEn = extractSummary(enRaw, "en");
    const authors = extractAuthors(ptRaw) || extractAuthors(enRaw);
    const ptSignatures = extractSignatures(ptRaw);
    const enSignatures = extractSignatures(enRaw);
    const hasRansomwareWord = /ransomware/i.test(disp);

    const ptEvidences = extractEvidencesFromMarkdown(ptRaw, key);
    const enEvidences = extractEvidencesFromMarkdown(enRaw, key);

    const ptSampleList: DynamicSample[] = [
      {
        id: `${reportId}-S-01`,
        sha: primarySha,
        verifyLabel: "Hash extraído do relatório técnico (PT)",
        verifySeverity: "success",
        fields: [
          { label: "Origem", value: "Repositório Oficial" },
          { label: "Formato", value: "Executável PE" },
        ],
        provenance: "Amostra registrada na documentação oficial em português.",
      },
    ];

    const enSampleList: DynamicSample[] = [
      {
        id: `${reportId}-S-01`,
        sha: primarySha,
        verifyLabel: "Hash extracted from technical report (EN)",
        verifySeverity: "success",
        fields: [
          { label: "Source", value: "Official Repository" },
          { label: "Format", value: "PE Executable" },
        ],
        provenance: "Sample recorded in official English study documentation.",
      },
    ];

    const ptExpList: DynamicExperiment[] = [
      {
        title: "Análise Dinâmica em Laboratório",
        date: "2026",
        fields: [
          { label: "Ambiente", value: "VirtualBox · Ambiente Isolado" },
          { label: "Ferramentas", value: "Procmon, PEStudio, Regshot" },
        ],
        result: summaryPt.slice(0, 240) + "...",
      },
    ];

    const enExpList: DynamicExperiment[] = [
      {
        title: "Dynamic Laboratory Analysis",
        date: "2026",
        fields: [
          { label: "Environment", value: "VirtualBox · Isolated Lab" },
          { label: "Tools", value: "Procmon, PEStudio, Regshot" },
        ],
        result: summaryEn.slice(0, 240) + "...",
      },
    ];

    families.push({
      key,
      name,
      disp,
      alias: hasRansomwareWord ? disp : `${disp} Ransomware`,
      aliases: `${disp}, ${disp} Variant`,
      authors,
      signatures: {
        pt: ptSignatures.length ? ptSignatures : enSignatures,
        en: enSignatures.length ? enSignatures : ptSignatures,
      },
      cat: "RANSOMWARE",
      headline: {
        pt: summaryPt.slice(0, 110) + "...",
        en: summaryEn.slice(0, 110) + "...",
      },
      plats: ["Windows"],
      samplesCount: shaMatches.length || 1,
      report: reportId,
      updated: "2026-09",
      ed: edStatus,
      id: "verified",
      ev: "observed",
      rec: edStatus === "published" ? "apparent" : "inconc",
      av: "ctrl",
      samples: { pt: ptSampleList, en: enSampleList },
      experiments: { pt: ptExpList, en: enExpList },
      evidences: { pt: ptEvidences, en: enEvidences },
      limitations: {
        pt: ["Consulte as limitações completas no relatório em Português."],
        en: ["Read the full limitation disclosures in the English report."],
      },
      summary: { pt: summaryPt, en: summaryEn },
      htmlContent: {
        pt: renderMarkdown(ptRaw),
        en: renderMarkdown(enRaw),
      },
      toc: {
        pt: extractToc(ptRaw),
        en: extractToc(enRaw),
      },
    });
  }

  return families;
}

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
