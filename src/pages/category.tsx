import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getCategory, getItemsByCategory } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PortfolioCard } from "@/components/portfolio-card";
import { Button } from "@/components/ui/button";
import { getLucideIcon } from "@/components/icon-map";
import { ArrowLeft } from "lucide-react";
import NotFound from "./not-found";

const ITEMS_PER_PAGE = 12;

export default function Category() {
  const { categorySlug } = useParams();
  const category = getCategory(categorySlug || "");
  const items = getItemsByCategory(categorySlug || "");
  
  useDocumentMeta(category?.title);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (!category) return <NotFound />;

  const Icon = getLucideIcon(category.icon);
  const displayedItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <Link href="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white font-mono text-sm mb-8 transition-colors">
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
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2">{category.title}</h1>
          {category.description && (
            <p className="text-muted-foreground text-lg max-w-2xl">{category.description}</p>
          )}
        </div>
      </motion.div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-mono glass-panel p-12">
          No projects currently visible in this category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedItems.map((item, i) => (
                <PortfolioCard key={item.slug} item={item} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="mt-16 flex justify-center">
              <Button 
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                variant="outline" 
                className="border-primary/50 text-primary hover:bg-primary hover:text-black font-mono uppercase tracking-widest px-8 py-6 rounded-none shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
