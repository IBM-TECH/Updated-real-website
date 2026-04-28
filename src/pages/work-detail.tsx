import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { getItem, portfolioItems } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { ArrowLeft, ArrowRight, Play, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NotFound from "./not-found";

export default function WorkDetail() {
  const { itemSlug } = useParams();
  const item = getItem(itemSlug || "");
  useDocumentMeta(item?.title);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!item) return <NotFound />;

  const currentIndex = portfolioItems.findIndex(p => p.slug === item.slug);
  const prevItem = currentIndex > 0 ? portfolioItems[currentIndex - 1] : null;
  const nextItem = currentIndex < portfolioItems.length - 1 ? portfolioItems[currentIndex + 1] : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-end pb-12">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback src={item.cover} slug={item.slug} className="w-full h-full opacity-40 blur-[2px] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-white/50 hover:text-primary font-mono text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 font-mono uppercase rounded-none backdrop-blur-sm">
                {item.category}
              </Badge>
              {item.medium && (
                <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/10 font-mono uppercase rounded-none backdrop-blur-sm">
                  {item.medium}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 drop-shadow-xl">{item.title}</h1>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-mono text-muted-foreground border-t border-white/10 pt-6 max-w-3xl">
              {item.client && (
                <div><span className="text-white/40 block mb-1">Client</span> <span className="text-white">{item.client}</span></div>
              )}
              {item.year && (
                <div><span className="text-white/40 block mb-1">Year</span> <span className="text-white">{item.year}</span></div>
              )}
              {item.tools && item.tools.length > 0 && (
                <div><span className="text-white/40 block mb-1">Tools</span> <span className="text-white">{item.tools.join(", ")}</span></div>
              )}
              {item.externalLink && (
                <div>
                  <span className="text-white/40 block mb-1">Link</span> 
                  <a href={item.externalLink} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    Visit Project <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Content */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit order-2 lg:order-1">
          <div className="prose prose-invert prose-primary max-w-none prose-p:text-muted-foreground prose-headings:font-display prose-headings:text-white">
            <div dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
          </div>
          
          {item.tags && item.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          {item.gallery && item.gallery.length > 0 ? (
            item.gallery.map((media, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 }}
                className="relative group cursor-pointer glass-panel overflow-hidden"
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              >
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center mix-blend-overlay">
                  <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm text-white">
                    <Play className="w-8 h-8 fill-current" />
                  </div>
                </div>
                
                {media.type === "image" && (
                  <ImageWithFallback src={media.src} alt={media.alt || item.title} slug={`${item.slug}-${i}`} className="w-full h-auto aspect-auto max-h-[80vh] object-contain bg-black/40" />
                )}
                {media.type === "video" && (
                  <div className="relative w-full aspect-video bg-black/40">
                    <video src={media.src} className="w-full h-full object-contain" muted loop playsInline />
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 bg-black/20 group-hover:bg-transparent transition-colors">
                      <Play className="w-12 h-12" />
                    </div>
                  </div>
                )}
                {(media.type === "youtube" || media.type === "vimeo") && (
                  <div className="relative w-full aspect-video bg-black/40 flex items-center justify-center">
                    <Play className="w-16 h-16 text-primary opacity-50" />
                    <span className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded text-xs font-mono text-white/80">
                      {media.type === "youtube" ? "YouTube" : "Vimeo"} Video
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <ImageWithFallback src={item.cover} alt={item.title} slug={item.slug} className="w-full aspect-[4/3] rounded-lg border border-white/10" />
          )}
        </div>
      </div>

      {/* Prev/Next Navigation */}
      <div className="container mx-auto px-4 mt-24 border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between gap-6">
        {prevItem ? (
          <Link href={`/work/${prevItem.slug}`} className="group flex-1 glass-panel p-6 hover:border-primary/50 transition-colors">
            <div className="text-sm font-mono text-muted-foreground mb-2 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Previous Project
            </div>
            <div className="font-display text-xl text-white group-hover:text-primary transition-colors truncate">{prevItem.title}</div>
          </Link>
        ) : <div className="flex-1" />}
        
        {nextItem ? (
          <Link href={`/work/${nextItem.slug}`} className="group flex-1 glass-panel p-6 hover:border-primary/50 transition-colors text-right">
            <div className="text-sm font-mono text-muted-foreground mb-2 flex items-center justify-end gap-2">
              Next Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-display text-xl text-white group-hover:text-primary transition-colors truncate">{nextItem.title}</div>
          </Link>
        ) : <div className="flex-1" />}
      </div>

      <GalleryLightbox 
        items={item.gallery || []} 
        initialIndex={lightboxIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
      />
    </div>
  );
}
