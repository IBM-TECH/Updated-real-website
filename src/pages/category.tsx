import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getCategory, getItemsByCategory } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PortfolioCard } from "@/components/portfolio-card";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Button } from "@/components/ui/button";
import { getLucideIcon } from "@/components/icon-map";
import { ArrowLeft, Play } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import NotFound from "./not-found";

const PAGE_SIZE = 24;

export default function Category() {
  const { categorySlug } = useParams();
  const category = getCategory(categorySlug || "");
  const items = getItemsByCategory(categorySlug || "");

  useDocumentMeta(category?.title);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!category) return <NotFound />;

  const Icon = getLucideIcon(category.icon);

  const gallery: GalleryItem[] = (category.gallery ?? []).filter(
    (g) => (g.src && g.src.length > 0) || (g.url && g.url.length > 0),
  );
  const visibleGallery = gallery.slice(0, visibleCount);
  const hasMore = visibleCount < gallery.length;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-white font-mono text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Work
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex items-center gap-6 border-b border-white/10 pb-8"
      >
        <div className="w-20 h-20 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Icon className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {category.description}
            </p>
          )}
          {(gallery.length > 0 || items.length > 0) && (
            <p className="text-xs font-mono text-muted-foreground mt-3">
              {gallery.length > 0 && `${gallery.length} piece${gallery.length === 1 ? "" : "s"}`}
              {gallery.length > 0 && items.length > 0 && " · "}
              {items.length > 0 && `${items.length} case stud${items.length === 1 ? "y" : "ies"}`}
            </p>
          )}
        </div>
      </motion.div>

      {gallery.length === 0 && items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-mono glass-panel p-12">
          No artwork in this category yet — check back soon.
        </div>
      ) : (
        <>
          {gallery.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {visibleGallery.map((g, i) => {
                  const isVideo = g.type === "video" || g.type === "youtube" || g.type === "vimeo";
                  const thumb = g.src || g.url || "";
                  return (
                    <motion.button
                      key={`${thumb}-${i}`}
                      type="button"
                      onClick={() => openLightbox(i)}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.4) }}
                      className="group relative aspect-square overflow-hidden rounded-md glass-panel border border-white/10 hover:border-primary/60 transition-colors no-default-hover-elevate"
                      aria-label={g.alt || `Open piece ${i + 1}`}
                    >
                      {g.type === "image" && g.src ? (
                        <ImageWithFallback
                          src={g.src}
                          slug={`${category.slug}-${i}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : g.type === "video" && g.src ? (
                        <video
                          src={g.src}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white/80" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {isVideo && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 border border-white/20">
                          <Play className="w-3 h-3 text-white" fill="white" />
                        </div>
                      )}
                      {g.alt && (
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity truncate">
                          {g.alt}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <Button
                    onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary hover:text-black font-mono uppercase tracking-widest px-8 py-6 rounded-none shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  >
                    Load More ({gallery.length - visibleCount} left)
                  </Button>
                </div>
              )}

              <GalleryLightbox
                items={gallery}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
              />
            </>
          )}

          {items.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/10 pb-3">
                Featured Case Studies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <PortfolioCard key={item.slug} item={item} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
