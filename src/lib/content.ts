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

// ... (keep aboutRaw and contactRaw exactly as they were in your file)
const aboutRaw = (import.meta.glob<string>("../../content/pages/about.md", { query: "?raw", import: "default", eager: true, }) as Record<string, string>)["../../content/pages/about.md"];
const contactRaw = (import.meta.glob<string>("../../content/pages/contact.md", { query: "?raw", import: "default", eager: true, }) as Record<string, string>)["../../content/pages/contact.md"];

export const siteSettings: SiteSettings = siteJson as SiteSettings;

export const categories: Category[] = Object.values(categoryFiles)
  .map((raw) => {
    const data = parseFrontmatter<Category>(raw).data;
    return { ...data, gallery: data.gallery ?? [] };
  })
  .filter((c) => c.visible !== false)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// NEW LOGIC: Combine file-based items + category images
const filePortfolioItems: PortfolioItem[] = Object.values(portfolioFiles)
  .map((raw) => {
    const { data, content } = parseFrontmatter<Omit<PortfolioItem, "body" | "bodyHtml">>(raw);
    return { ...data, gallery: data.gallery ?? [], tools: data.tools ?? [], tags: data.tags ?? [], body: content, bodyHtml: renderMarkdown(content) } as PortfolioItem;
  });

const categoryGalleryItems: PortfolioItem[] = categories.flatMap(cat => {
    const gallery = Array.isArray(cat.gallery) ? cat.gallery : [];
    return gallery.map((img, i) => ({
        slug: `${cat.slug}-${i}`,
        title: `${cat.title} ${i + 1}`,
        category: cat.slug,
        coverImage: img,
        gallery: [img],
        body: "", bodyHtml: "", date: new Date().toISOString(),
        featured: false, visible: true, tools: [], tags: []
    }));
});

export const portfolioItems: PortfolioItem[] = [...filePortfolioItems, ...categoryGalleryItems]
  .filter((p) => p.visible !== false)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const featuredItems: PortfolioItem[] = portfolioItems.filter((p) => p.featured);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getItemsByCategory(slug: string): PortfolioItem[] {
  return portfolioItems.filter((p) => p.category === slug);
}

export function getItem(slug: string): PortfolioItem | undefined {
  return portfolioItems.find((p) => p.slug === slug);
}

// ... (keep about and contact logic at the bottom exactly as it was)
const aboutParsed = parseFrontmatter<Omit<AboutContent, "body" | "bodyHtml">>(aboutRaw);
export const about: AboutContent = { ...aboutParsed.data, skills: aboutParsed.data.skills ?? [], timeline: aboutParsed.data.timeline ?? [], body: aboutParsed.content, bodyHtml: renderMarkdown(aboutParsed.content), };
const contactParsed = parseFrontmatter<Omit<ContactContent, "body" | "bodyHtml">>(contactRaw);
export const contact: ContactContent = { ...contactParsed.data, socials: contactParsed.data.socials ?? [], body: contactParsed.content, bodyHtml: renderMarkdown(contactParsed.content), };
export const allTags: string[] = Array.from(new Set(portfolioItems.flatMap((p) => p.tags ?? []))).sort();
