import { useState, Suspense, lazy } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { siteSettings, contact } from "@/lib/content";
import { Menu, X } from "lucide-react";
import { getSocialIcon } from "./icon-map";

const ThreeBackground = lazy(() => import("./three-background"));

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const showAdmin = import.meta.env.DEV || (typeof window !== "undefined" && window.location.search.includes("admin=1"));

  return (
    <div className="min-h-[100dvh] flex flex-col relative text-foreground">
      <div className="scanlines" />
      <div className="noise-bg" />
      
      <div className="fixed inset-0 z-[-1]">
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <ThreeBackground />
        </Suspense>
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            {siteSettings.logo ? (
              <img src={siteSettings.logo} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="h-8 w-8 bg-primary/20 border border-primary/50 text-primary flex items-center justify-center font-display font-bold neon-glow glitch-hover">
                {siteSettings.artistName.split(" ").map(w => w[0]).join("").substring(0, 2)}
              </div>
            )}
            <span className="font-display font-bold text-lg tracking-wider hidden sm:block glitch-hover">
              {siteSettings.siteTitle.split(" // ")[0]}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-white transition-colors py-2">
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 glass-panel bg-background/95 flex flex-col p-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
                <X className="w-8 h-8" />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-display text-4xl font-bold uppercase tracking-wider ${location === link.href ? "text-primary neon-glow" : "text-white"}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-16 relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 glass-panel border-t border-white/5 py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-muted-foreground text-sm font-mono">
            © {new Date().getFullYear()} {siteSettings.artistName}. All rights reserved.
          </div>
          
          <div className="flex gap-4">
            {contact.socials.slice(0, 4).map((social) => {
              const Icon = getSocialIcon(social.platform);
              return (
                <a key={social.platform} href={social.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              );
            })}
          </div>

          {showAdmin && (
            <a href="/admin/" className="text-xs text-muted-foreground/30 hover:text-white absolute bottom-2 right-2">
              Edit in CMS
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
