import { withBase } from "../../utils/paths";
import { normalizeContentPath, guideIdFromDocument, reportIdFromDocument } from "./utils";

export const reportFiles = import.meta.glob("/src/content/docs/reports/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const guideFiles = import.meta.glob("/src/content/docs/guides/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const templateFiles = import.meta.glob("/src/content/docs/templates/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const generalFiles = import.meta.glob("/src/content/docs/general/**/*.md", {
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

export function resolveImageUrls(
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

export function resolveMarkdownLinks(markdownText: string, documentPath: string): string {
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
