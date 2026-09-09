import { Lang } from "../families";

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
