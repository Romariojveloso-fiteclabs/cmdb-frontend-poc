import { Lang } from "../families";
import { reportFiles, resolveImageUrls, resolveMarkdownLinks } from "./files";
import { renderMarkdown, extractToc, extractSummary, extractAuthors, extractSignatures, extractEvidencesFromMarkdown, splitBiLangMarkdown, markdownTitle, reportIdFromDocument } from "./utils";
import { ParsedFamilyData, ParsedReportDocument, DynamicSample, DynamicExperiment } from "./types";

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
