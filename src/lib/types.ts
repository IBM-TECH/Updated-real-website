export interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
}

export interface SiteSettings {
  siteTitle: string;
  artistName: string;
  tagline: string;
  heroSubtitle: string;
  logo?: string;
  favicon?: string;
  heroBackground?: string;
  heroVideo?: string;
  seoDescription: string;
  seoKeywords?: string;
  ogImage?: string;
  theme: ThemeSettings;
}

export interface Category {
  title: string;
  slug: string;
  description?: string;
  cover?: string;
  icon?: string;
  order: number;
  featured: boolean;
  visible: boolean;
  gallery?: GalleryItem[];
}

export type Medium = "2d" | "3d" | "video" | "mixed";
export type GalleryItemType = "image" | "video" | "youtube" | "vimeo";

export interface GalleryItem {
  type: GalleryItemType;
  src?: string;
  url?: string;
  alt?: string;
}

export interface PortfolioItem {
  title: string;
  slug: string;
  date: string;
  category: string;
  medium: Medium;
  featured: boolean;
  visible: boolean;
  order: number;
  cover: string;
  gallery: GalleryItem[];
  tools: string[];
  tags: string[];
  client?: string;
  year?: string;
  externalLink?: string;
  excerpt?: string;
  body: string;
  bodyHtml: string;
}

export interface SkillItem {
  name: string;
  category?: string;
  level: number;
  icon?: string;
}

export type TimelineType = "work" | "education" | "award" | "exhibition" | "milestone";

export interface TimelineItem {
  year: string;
  title: string;
  organization?: string;
  description: string;
  type: TimelineType;
}

export interface AboutContent {
  heading: string;
  subheading: string;
  portrait?: string;
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
  awards: number;
  skills: SkillItem[];
  timeline: TimelineItem[];
  body: string;
  bodyHtml: string;
}

export type SocialPlatform =
  | "instagram"
  | "twitter"
  | "x"
  | "behance"
  | "dribbble"
  | "artstation"
  | "youtube"
  | "vimeo"
  | "tiktok"
  | "linkedin"
  | "github"
  | "twitch"
  | "deviantart"
  | "pinterest"
  | "discord"
  | "telegram"
  | "fiverr"
  | "email"
  | "website";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
  handle?: string;
}

export interface ContactContent {
  heading: string;
  subheading: string;
  email: string;
  phone?: string;
  location?: string;
  available: boolean;
  bookingUrl?: string;
  socials: SocialLink[];
  body: string;
  bodyHtml: string;
}
