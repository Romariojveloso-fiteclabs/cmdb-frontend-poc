import { Lang } from './families';
import { parseAllGuidesFromMarkdown } from './markdownLoader';

export interface LabGuide {
  id: string;
  title: string;
  desc: string;
  level: string;
  severity: 'info' | 'warning' | 'success' | 'secondary';
  lang: string;
  updated: string;
  content?: string;
  htmlContent?: string;
}

export const LAB_GUIDES: Record<Lang, LabGuide[]> = parseAllGuidesFromMarkdown();
