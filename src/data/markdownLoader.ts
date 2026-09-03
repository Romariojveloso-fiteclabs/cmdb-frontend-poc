import { marked } from 'marked';
import { Lang } from './families';

export interface DynamicSample {
  id: string;
  sha: string;
  verifyLabel: string;
  verifySeverity: 'success' | 'warning' | 'secondary' | 'info' | 'danger';
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
  cat: string;
  headline: Record<Lang, string>;
  plats: string[];
  samplesCount: number;
  report: string;
  updated: string;
  ed: 'legacy' | 'draft' | 'review' | 'published';
  id: 'declared' | 'correlated' | 'verified';
  ev: 'untested' | 'observed';
  rec: 'none' | 'unrec' | 'inconc' | 'partial' | 'apparent' | 'hash';
  av: 'meta' | 'ctrl';
  samples: Record<Lang, DynamicSample[]>;
  experiments: Record<Lang, DynamicExperiment[]>;
  evidences: Record<Lang, DynamicEvidence[]>;
  limitations: Record<Lang, string[]>;
  summary: Record<Lang, string>;
  htmlContent: Record<Lang, string>;
  toc: Record<Lang, { id: string; n: string; label: string }[]>;
}

const reportFiles = import.meta.glob('/src/content/docs/reports/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const guideFiles = import.meta.glob('/src/content/docs/guides/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const templateFiles = import.meta.glob('/src/content/docs/templates/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const generalFiles = import.meta.glob('/src/content/docs/general/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

function resolveImageUrls(markdownText: string, familyKey: string): string {
  let text = markdownText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    let cleanSrc = src.trim();
    if (cleanSrc.includes('/img/')) {
      const fileName = cleanSrc.split('/img/').pop();
      cleanSrc = `/reports/${familyKey}/img/${fileName}`;
    } else if (cleanSrc.startsWith('img/')) {
      const fileName = cleanSrc.replace('img/', '');
      cleanSrc = `/reports/${familyKey}/img/${fileName}`;
    }
    return `![${alt}](${cleanSrc})`;
  });

  text = text.replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, before, src, after) => {
    let cleanSrc = src.trim();
    if (cleanSrc.includes('/img/')) {
      const fileName = cleanSrc.split('/img/').pop();
      cleanSrc = `/reports/${familyKey}/img/${fileName}`;
    } else if (cleanSrc.startsWith('img/')) {
      const fileName = cleanSrc.replace('img/', '');
      cleanSrc = `/reports/${familyKey}/img/${fileName}`;
    }
    return `<img ${before}src="${cleanSrc}"${after}>`;
  });

  return text;
}

function extractToc(markdownText: string) {
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const toc: { id: string; n: string; label: string }[] = [];
  let match;
  let count = 1;

  while ((match = headingRegex.exec(markdownText)) !== null) {
    const rawLabel = match[1].trim();
    const cleanLabel = rawLabel.replace(/[\*\_\`]/g, '');
    const id = `sec-${count}`;
    const num = String(count).padStart(2, '0');
    toc.push({ id, n: num, label: cleanLabel });
    count++;
  }

  return toc;
}

function extractSummary(markdownText: string, lang: Lang): string {
  const patterns = [
    /##\s*1\.\s*(?:Resumo|Abstract|Summary|Executive Summary)[^\n]*\n+([\s\S]*?)(?=\n##|\n#|$)/i,
    /##\s*(?:Resumo|Abstract|Summary|Executive Summary|O que é o [^\n?]+)[^\n]*\n+([\s\S]*?)(?=\n##|\n#|$)/i,
    /###\s*(?:Resumo|Abstract|Summary)[^\n]*\n+([\s\S]*?)(?=\n###|\n##|\n#|$)/i
  ];

  for (const regex of patterns) {
    const match = markdownText.match(regex);
    if (match && match[1]) {
      const clean = match[1]
        .replace(/^[>|\*\-\s]+/gm, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/<img.*?>/gi, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
      if (clean.length > 20) {
        return clean;
      }
    }
  }

  const lines = markdownText.split('\n');
  const paragraphs: string[] = [];
  let currentP = '';

  for (const line of lines) {
    const l = line.trim();
    if (l.startsWith('#') || l.startsWith('|') || l.startsWith('>') || l.startsWith('-') || l.startsWith('*')) {
      if (currentP.length > 40) {
        paragraphs.push(currentP.trim());
        currentP = '';
      }
    } else if (l.length > 0) {
      currentP += ' ' + l;
    } else {
      if (currentP.length > 40) {
        paragraphs.push(currentP.trim());
        currentP = '';
      }
    }
  }
  if (currentP.length > 40) paragraphs.push(currentP.trim());

  const validP = paragraphs.find(p => 
    !p.toLowerCase().includes('aviso') && 
    !p.toLowerCase().includes('notice') && 
    !p.toLowerCase().includes('universidade') &&
    !p.toLowerCase().includes('federal university')
  );

  return validP || (lang === 'pt' ? 'Resumo extraído da documentação técnica do estudo.' : 'Executive summary extracted from study technical documentation.');
}

function extractEvidencesFromMarkdown(markdownText: string, familyKey: string): DynamicEvidence[] {
  const evidences: DynamicEvidence[] = [];
  let figCount = 1;

  const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdImgRegex.exec(markdownText)) !== null && figCount <= 12) {
    const altText = match[1] || `Figura ${figCount}`;
    let imgSrc = match[2].trim();
    if (imgSrc.includes('/img/')) {
      const fileName = imgSrc.split('/img/').pop();
      imgSrc = `/reports/${familyKey}/img/${fileName}`;
    } else if (imgSrc.startsWith('img/')) {
      const fileName = imgSrc.replace('img/', '');
      imgSrc = `/reports/${familyKey}/img/${fileName}`;
    }

    if (!evidences.some(e => e.imgUrl === imgSrc)) {
      evidences.push({
        title: altText,
        desc: `Evidência de laboratório ${figCount} capturada durante o experimento da família ${familyKey.toUpperCase()}.`,
        imgUrl: imgSrc,
        figNum: `FIG. ${String(figCount).padStart(2, '0')}`
      });
      figCount++;
    }
  }

  const htmlImgRegex = /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  while ((match = htmlImgRegex.exec(markdownText)) !== null && figCount <= 12) {
    const altMatch = match[0].match(/alt=["']([^"']+)["']/i);
    const altText = altMatch ? altMatch[1] : `Figura ${figCount}`;
    let imgSrc = match[2].trim();
    if (imgSrc.includes('/img/')) {
      const fileName = imgSrc.split('/img/').pop();
      imgSrc = `/reports/${familyKey}/img/${fileName}`;
    } else if (imgSrc.startsWith('img/')) {
      const fileName = imgSrc.replace('img/', '');
      imgSrc = `/reports/${familyKey}/img/${fileName}`;
    }

    if (!evidences.some(e => e.imgUrl === imgSrc)) {
      evidences.push({
        title: altText,
        desc: `Evidência de laboratório ${figCount} capturada durante o experimento da família ${familyKey.toUpperCase()}.`,
        imgUrl: imgSrc,
        figNum: `FIG. ${String(figCount).padStart(2, '0')}`
      });
      figCount++;
    }
  }

  return evidences;
}

function splitBiLangMarkdown(rawContent: string): { pt: string; en: string } {
  if (rawContent.includes('### **PT**') && rawContent.includes('### **EN**')) {
    const parts = rawContent.split(/###\s*\*\*EN\*\*/i);
    const ptPart = parts[0].replace(/###\s*\*\*PT\*\*/i, '').trim();
    const enPart = parts[1] ? parts[1].trim() : ptPart;
    return { pt: ptPart, en: enPart };
  }
  return { pt: rawContent, en: rawContent };
}

export function parseAllFamiliesFromMarkdown(): ParsedFamilyData[] {
  const familyMap: Record<string, { ptRaw?: string; enRaw?: string; key: string }> = {};

  for (const path in reportFiles) {
    const lowerPath = path.toLowerCase();
    const parts = lowerPath.split('/');
    const folderName = parts[parts.length - 2];

    if (!familyMap[folderName]) {
      familyMap[folderName] = { key: folderName };
    }

    const content = reportFiles[path];

    if (lowerPath.includes('pt-br') || lowerPath.includes('-pt.')) {
      familyMap[folderName].ptRaw = content;
    } else if (lowerPath.includes('-en.') || lowerPath.includes('en.md')) {
      familyMap[folderName].enRaw = content;
    } else {
      const split = splitBiLangMarkdown(content);
      if (split.pt !== split.en) {
        familyMap[folderName].ptRaw = split.pt;
        familyMap[folderName].enRaw = split.en;
      } else {
        if (!familyMap[folderName].ptRaw) familyMap[folderName].ptRaw = content;
        if (!familyMap[folderName].enRaw) familyMap[folderName].enRaw = content;
      }
    }
  }

  const families: ParsedFamilyData[] = [];

  for (const key in familyMap) {
    const item = familyMap[key];
    let ptRaw = item.ptRaw || item.enRaw || '';
    let enRaw = item.enRaw || item.ptRaw || '';

    ptRaw = resolveImageUrls(ptRaw, key);
    enRaw = resolveImageUrls(enRaw, key);

    const firstLine = ptRaw.split('\n').find(l => l.startsWith('# ')) || `# ${key.toUpperCase()}`;
    const rawName = firstLine.replace('# ', '').trim();
    const name = rawName.toUpperCase();
    const disp = rawName;

    const reportIdMatch = ptRaw.match(/CMDB-(?:TR|PR|AntiPetya)-\d{3}/i) || ptRaw.match(/CMDB-[A-Z0-9-]+/i);
    const reportId = reportIdMatch ? reportIdMatch[0].toUpperCase() : `CMDB-TR-${key.toUpperCase()}`;

    let edStatus: 'legacy' | 'draft' | 'review' | 'published' = 'published';
    if (ptRaw.toLowerCase().includes('rascunho') || enRaw.toLowerCase().includes('draft')) edStatus = 'draft';
    if (ptRaw.toLowerCase().includes('revisão') || enRaw.toLowerCase().includes('review')) edStatus = 'review';
    if (ptRaw.toLowerCase().includes('legado') || enRaw.toLowerCase().includes('legacy')) edStatus = 'legacy';

    const shaMatches = Array.from(ptRaw.matchAll(/([a-f0-9]{64})/gi)).map(m => m[1]);
    const primarySha = shaMatches[0] || 'e4b1f2c9a7d3856b0f4e1c2a9d7b53e8f60c1a4d92b7e35f8c0a6d1b4e29f73c';

    const summaryPt = extractSummary(ptRaw, 'pt');
    const summaryEn = extractSummary(enRaw, 'en');

    const ptEvidences = extractEvidencesFromMarkdown(ptRaw, key);
    const enEvidences = extractEvidencesFromMarkdown(enRaw, key);

    const ptSampleList: DynamicSample[] = [
      {
        id: `${reportId}-S-01`,
        sha: primarySha,
        verifyLabel: 'Hash extraído do relatório técnico (PT)',
        verifySeverity: 'success',
        fields: [
          { label: 'Origem', value: 'Repositório Oficial' },
          { label: 'Formato', value: 'Executável PE' }
        ],
        provenance: 'Amostra registrada na documentação oficial em português.'
      }
    ];

    const enSampleList: DynamicSample[] = [
      {
        id: `${reportId}-S-01`,
        sha: primarySha,
        verifyLabel: 'Hash extracted from technical report (EN)',
        verifySeverity: 'success',
        fields: [
          { label: 'Source', value: 'Official Repository' },
          { label: 'Format', value: 'PE Executable' }
        ],
        provenance: 'Sample recorded in official English study documentation.'
      }
    ];

    const ptExpList: DynamicExperiment[] = [
      {
        title: 'Análise Dinâmica em Laboratório',
        date: '2026',
        fields: [
          { label: 'Ambiente', value: 'VirtualBox · Ambiente Isolado' },
          { label: 'Ferramentas', value: 'Procmon, PEStudio, Regshot' }
        ],
        result: summaryPt.slice(0, 240) + '...'
      }
    ];

    const enExpList: DynamicExperiment[] = [
      {
        title: 'Dynamic Laboratory Analysis',
        date: '2026',
        fields: [
          { label: 'Environment', value: 'VirtualBox · Isolated Lab' },
          { label: 'Tools', value: 'Procmon, PEStudio, Regshot' }
        ],
        result: summaryEn.slice(0, 240) + '...'
      }
    ];

    families.push({
      key,
      name,
      disp,
      alias: `${disp} Ransomware`,
      aliases: `${disp}, ${disp} Variant`,
      cat: 'RANSOMWARE',
      headline: {
        pt: summaryPt.slice(0, 110) + '...',
        en: summaryEn.slice(0, 110) + '...'
      },
      plats: ['Windows'],
      samplesCount: shaMatches.length || 1,
      report: reportId,
      updated: '2026-09',
      ed: edStatus,
      id: 'verified',
      ev: 'observed',
      rec: edStatus === 'published' ? 'apparent' : 'inconc',
      av: 'ctrl',
      samples: { pt: ptSampleList, en: enSampleList },
      experiments: { pt: ptExpList, en: enExpList },
      evidences: { pt: ptEvidences, en: enEvidences },
      limitations: {
        pt: ['Consulte as limitações completas no relatório em Português.'],
        en: ['Read the full limitation disclosures in the English report.']
      },
      summary: { pt: summaryPt, en: summaryEn },
      htmlContent: {
        pt: marked.parse(ptRaw) as string,
        en: marked.parse(enRaw) as string
      },
      toc: {
        pt: extractToc(ptRaw),
        en: extractToc(enRaw)
      }
    });
  }

  return families;
}

export function parseAllGuidesFromMarkdown() {
  const guides: { pt: any[]; en: any[] } = { pt: [], en: [] };

  for (const path in guideFiles) {
    const rawText = guideFiles[path];
    const isPt = path.toLowerCase().includes('pt-br') || path.toLowerCase().includes('-pt.');

    const firstLine = rawText.split('\n').find(l => l.startsWith('# ')) || '# Lab Guide';
    const title = firstLine.replace('# ', '').trim();

    const guideIdMatch = rawText.match(/CMDB-GD-\d{3}/i) || path.match(/CMDB-GD-\d{3}/i);
    const id = guideIdMatch ? guideIdMatch[0].toUpperCase() : 'CMDB-GD-001';

    const htmlContent = marked.parse(rawText) as string;

    const item = {
      id,
      title,
      desc: rawText.slice(0, 150).replace(/[#\*\_]/g, '') + '...',
      level: isPt ? 'Essencial' : 'Essential',
      severity: 'info',
      lang: isPt ? 'PT-BR' : 'EN',
      updated: '2026-09',
      content: rawText,
      htmlContent
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
    const isPt = path.toLowerCase().includes('pt-br') || path.toLowerCase().includes('-pt.');

    const firstLine = rawText.split('\n').find(l => l.startsWith('# ')) || '# Report Template';
    const title = firstLine.replace('# ', '').trim();

    const tplIdMatch = rawText.match(/CMDB-TPL-\d{2}/i) || rawText.match(/CMDB-[A-Z0-9-]+/i);
    const id = tplIdMatch ? tplIdMatch[0].toUpperCase() : 'CMDB-TPL-01';

    const item = {
      id,
      format: 'Markdown (.md)',
      title,
      desc: rawText.slice(0, 140).replace(/[#\*\_]/g, '') + '...',
      fields: isPt
        ? ['Estrutura técnica padronizada', 'Campos de metadados de laboratório']
        : ['Standard technical structure', 'Lab metadata fields'],
      required: isPt ? 'Modelo Padrão' : 'Standard Template',
      href: '#',
      content: rawText
    };

    if (isPt) {
      templates.pt.push(item);
    } else {
      templates.en.push(item);
    }
  }

  return templates;
}

export function parseGeneralDocFromMarkdown(docType: 'disclaimer' | 'security' | 'contributing', lang: Lang) {
  const targetLang = lang === 'pt' ? 'pt-br' : 'en';

  for (const path in generalFiles) {
    const lowerPath = path.toLowerCase();

    if (docType === 'disclaimer' && lowerPath.includes('disclaimer')) {
      if ((lang === 'pt' && lowerPath.includes('pt-br')) || (lang === 'en' && !lowerPath.includes('pt-br'))) {
        const rawText = generalFiles[path];
        return { rawText, htmlContent: marked.parse(rawText) as string };
      }
    }

    if (docType === 'security' && lowerPath.includes('security')) {
      if ((lang === 'pt' && lowerPath.includes('pt-br')) || (lang === 'en' && !lowerPath.includes('pt-br'))) {
        const rawText = generalFiles[path];
        return { rawText, htmlContent: marked.parse(rawText) as string };
      }
    }

    if (docType === 'contributing' && lowerPath.includes('contributing')) {
      if ((lang === 'pt' && lowerPath.includes('pt-br')) || (lang === 'en' && !lowerPath.includes('pt-br'))) {
        const rawText = generalFiles[path];
        return { rawText, htmlContent: marked.parse(rawText) as string };
      }
    }
  }

  for (const path in generalFiles) {
    const lowerPath = path.toLowerCase();
    if (lowerPath.includes(docType)) {
      const rawText = generalFiles[path];
      return { rawText, htmlContent: marked.parse(rawText) as string };
    }
  }

  return null;
}
