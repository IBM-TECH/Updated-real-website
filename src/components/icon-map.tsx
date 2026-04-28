import { type LucideIcon, Brush, User, Box, Mountain, Scissors, Palette, Sun, Film, Compass, Cpu, Camera, Monitor, Globe, Image as ImageIcon, Zap, Code, Gamepad, PenTool, LayoutGrid } from "lucide-react";
import { FaInstagram, FaTwitter, FaBehance, FaDribbble, FaArtstation, FaYoutube, FaVimeo, FaTiktok, FaLinkedin, FaGithub, FaTwitch, FaDeviantart, FaPinterest, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { SiFiverr } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdLanguage } from "react-icons/md";
import type { SocialPlatform } from "@/lib/types";

export const getLucideIcon = (name?: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    Brush, User, Box, Mountain, Scissors, Palette, Sun, Film, Compass, Cpu, Camera, Monitor, Globe, Image: ImageIcon, Zap, Code, Gamepad, PenTool, LayoutGrid
  };
  return name && iconMap[name] ? iconMap[name] : Box;
};

export const getSocialIcon = (platform: SocialPlatform) => {
  const map: Record<SocialPlatform, any> = {
    instagram: FaInstagram,
    twitter: FaTwitter,
    x: FaXTwitter,
    behance: FaBehance,
    dribbble: FaDribbble,
    artstation: FaArtstation,
    youtube: FaYoutube,
    vimeo: FaVimeo,
    tiktok: FaTiktok,
    linkedin: FaLinkedin,
    github: FaGithub,
    twitch: FaTwitch,
    deviantart: FaDeviantart,
    pinterest: FaPinterest,
    discord: FaDiscord,
    telegram: FaTelegramPlane,
    fiverr: SiFiverr,
    email: MdEmail,
    website: MdLanguage
  };
  return map[platform] || MdLanguage;
};
