import yaml from "js-yaml";
import { marked } from "marked";
import siteJson from "../../content/settings/site.json";
import type {
  AboutContent,
  Category,
  ContactContent,
  PortfolioItem,
  SiteSettings,
} from "./types";

marked.setOptions({ gfm: true, breaks: false });

function renderMarkdown(md: string): string {
  if (!md) return "";
  return marked.parse(md, { async: false }) as string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseFrontmatter<T>(raw: string): { data: T; content: string } {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { data: {} as T, content: raw };
  }
  const data = (yaml.load(match[1]) ?? {}) as T;
  return { data, content: match[2] ?? "" };
}

const categoryFiles = import.meta.glob<string>("../../content/categories/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const portfolioFiles = import.meta.glob<string>("../../content/portfolio/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const aboutRaw = (
  import.meta.glob<string>("../../content/pages/about.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>
)["../../content/pages/about.md"];

const contactRaw = (
  import.meta.glob<string>("../../content/pages/contact.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>
)["../../content/pages/contact.md"];

export const siteSettings: SiteSettings = siteJson as SiteSettings;

export const categories: Category[] = Object.values(categoryFiles)
  .map((raw) => {
    const data = parseFrontmatter<Category>(raw).data;
    return { ...data, gallery: data.gallery ?? [] };
  })
  .filter((c) => c.visible !== false)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const portfolioItems: PortfolioItem[] = Object.values(portfolioFiles)
  .map((raw) => {
    const { data, content } = parseFrontmatter<Omit<PortfolioItem, "body" | "bodyHtml">>(raw);
    return {
      ...data,
      gallery: data.gallery ?? [],
      tools: data.tools ?? [],
      tags: data.tags ?? [],
      body: content,
      bodyHtml: renderMarkdown(content),
    } as PortfolioItem;
  })
  .filter((p) => p.visible !== false)
  .sort((a, b) => {
    const ao = a.order ?? 0;
    const bo = b.order ?? 0;
    if (ao !== bo) return ao - bo;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

export const featuredItems: PortfolioItem[] = portfolioItems.filter(
  (p) => p.featured,
);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getItemsByCategory(slug: string): PortfolioItem[] {
  return portfolioItems.filter((p) => p.category === slug);
}

export function getItem(slug: string): PortfolioItem | undefined {
  return portfolioItems.find((p) => p.slug === slug);
}

const aboutParsed = parseFrontmatter<Omit<AboutContent, "body" | "bodyHtml">>(aboutRaw);
export const about: AboutContent = {
  ...aboutParsed.data,
  skills: aboutParsed.data.skills ?? [],
  timeline: aboutParsed.data.timeline ?? [],
  body: aboutParsed.content,
  bodyHtml: renderMarkdown(aboutParsed.content),
};

const contactParsed = parseFrontmatter<Omit<ContactContent, "body" | "bodyHtml">>(contactRaw);
export const contact: ContactContent = {
  ...contactParsed.data,
  socials: contactParsed.data.socials ?? [],
  body: contactParsed.content,
  bodyHtml: renderMarkdown(contactParsed.content),
};

export const allTags: string[] = Array.from(
  new Set(portfolioItems.flatMap((p) => p.tags ?? [])),
).sort();
