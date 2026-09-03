import { Lang } from './families';
import { parseAllTemplatesFromMarkdown } from './markdownLoader';

export interface DocTemplate {
  id: string;
  format: string;
  title: string;
  desc: string;
  fields: string[];
  required: string;
  href: string;
  content: string;
}

export const DOC_TEMPLATES: Record<Lang, DocTemplate[]> = parseAllTemplatesFromMarkdown();
