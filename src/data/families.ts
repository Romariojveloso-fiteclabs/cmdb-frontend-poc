import { parseAllFamiliesFromMarkdown, ParsedFamilyData } from './markdownLoader';

export type Lang = 'pt' | 'en';

export interface MalwareFamily {
  key: string;
  name: string;
  disp: string;
  alias: string;
  aliases: string;
  cat: string;
  headline: { pt: string; en: string };
  plats: string[];
  samples: number;
  report: string;
  updated: string;
  ed: 'legacy' | 'draft' | 'review' | 'published';
  id: 'declared' | 'correlated' | 'verified';
  ev: 'untested' | 'observed';
  rec: 'none' | 'unrec' | 'inconc' | 'partial' | 'apparent' | 'hash';
  av: 'meta' | 'ctrl';
}

export interface DimensionMeta {
  pt: string;
  en: string;
  sev: 'secondary' | 'warning' | 'info' | 'success' | 'danger';
}

export const DIMENSIONS: Record<string, Record<string, DimensionMeta>> = {
  ed: {
    legacy: { pt: 'Legado', en: 'Legacy', sev: 'secondary' },
    draft: { pt: 'Rascunho', en: 'Draft', sev: 'warning' },
    review: { pt: 'Em revisão', en: 'In review', sev: 'info' },
    published: { pt: 'Publicado', en: 'Published', sev: 'success' }
  },
  id: {
    declared: { pt: 'Declarada pela fonte', en: 'Source-declared', sev: 'warning' },
    correlated: { pt: 'Correlacionada', en: 'Correlated', sev: 'info' },
    verified: { pt: 'Verificada', en: 'Verified', sev: 'success' }
  },
  ev: {
    untested: { pt: 'Não testada', en: 'Not tested', sev: 'secondary' },
    observed: { pt: 'Observada em laboratório', en: 'Observed in lab', sev: 'info' }
  },
  rec: {
    none: { pt: 'Não avaliada', en: 'Not assessed', sev: 'secondary' },
    unrec: { pt: 'Não reconhecida', en: 'Not recognised', sev: 'secondary' },
    inconc: { pt: 'Inconclusiva', en: 'Inconclusive', sev: 'warning' },
    partial: { pt: 'Recuperação parcial', en: 'Partial recovery', sev: 'warning' },
    apparent: { pt: 'Funcional aparente', en: 'Apparently functional', sev: 'info' },
    hash: { pt: 'Validada por hash', en: 'Hash-validated', sev: 'success' }
  },
  av: {
    meta: { pt: 'Somente metadados', en: 'Metadata only', sev: 'secondary' },
    ctrl: { pt: 'Artefato controlado', en: 'Controlled artefact', sev: 'danger' }
  }
};

export const PARSED_FAMILIES = parseAllFamiliesFromMarkdown();

export const FAMILIES: MalwareFamily[] = PARSED_FAMILIES.map(f => ({
  key: f.key,
  name: f.name,
  disp: f.disp,
  alias: f.alias,
  aliases: f.aliases,
  cat: f.cat,
  headline: f.headline,
  plats: f.plats,
  samples: f.samplesCount,
  report: f.report,
  updated: f.updated,
  ed: f.ed,
  id: f.id,
  ev: f.ev,
  rec: f.rec,
  av: f.av
}));

export const SAMPLE_SHAS: Record<string, string> = {};
PARSED_FAMILIES.forEach(f => {
  if (f.samples.pt[0]?.sha) {
    SAMPLE_SHAS[f.key] = f.samples.pt[0].sha;
  }
});
