import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Button } from "@/components/ui/button";
import { getLucideIcon } from "@/components/icon-map";

const ITEMS_PER_PAGE = 12;

export default function Portfolio() {
  useDocumentMeta("Work");
  const [filter, setFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Extract all images directly from categories to bypass "Works"
  const allImages = categories.flatMap(cat => {
    // @ts-ignore - bypassing strict types since gallery is dynamically added
    const gallery = cat.gallery || [];
    const images = Array.isArray(gallery) ? gallery : (gallery ? [gallery] : []);

    return images.map((img, index) => ({
      id: `${cat.slug}-${index}`,
      title: `${cat.title} #${index + 1}`,
      category: cat.slug,
      categoryTitle: cat.title,
      coverImage: img,
    }));
  });

  const filteredItems = allImages.filter((item) => {
    if (filter !== "all" && item.category !== filter) return false;
    return true;
  });

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center max-w-2xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4">All Work</h1>
        <div className="h-1 w-20 bg-secondary shadow-[0_0_10px_rgba(255,0,229,0.5)] mx-auto mb-6" />
        <p className="text-muted-foreground text-lg">
          A selection of personal and commercial projects spanning concept art, 3D modeling, and motion design.
        </p>
      </motion.div>

      {/* Categories Grid (only show when 'all' is selected) */}
      {filter === "all" && visibleCount === ITEMS_PER_PAGE && (
        <div className="mb-20">
          <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-4">
            Browse by Category
            <div className="h-[1px] flex-1 bg-white/10" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const Icon = getLucideIcon(cat.icon);
              const count = allImages.filter(p => p.category === cat.slug).length;
              return (
                <div 
                  key={cat.slug} 
                  onClick={() => { setFilter(cat.slug); setVisibleCount(ITEMS_PER_PAGE); }}
                  className="cursor-pointer"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel p-4 flex flex-col items-center justify-center text-center gap-3 aspect-square hover:bg-white/5 border-white/5 hover:border-primary/50 transition-colors group"
                  >
                    <Icon className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="font-display font-bold text-sm">{cat.title}</span>
                    <span className="font-mono text-xs text-muted-foreground">{count} Projects</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="sticky top-20 z-30 glass-panel bg-background/80 py-4 px-6 mb-12 flex flex-col md:flex-row gap-4 justify-between items-center border-y border-white/10">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className={filter === "all" ? "bg-primary text-black hover:bg-primary/90" : "border-white/10 hover:bg-white/5"}
            onClick={() => { setFilter("all"); setVisibleCount(ITEMS_PER_PAGE); }}
          >
            All Categories
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat.slug}
              variant={filter === cat.slug ? "default" : "outline"}
              size="sm"
              className={filter === cat.slug ? "bg-primary text-black hover:bg-primary/90" : "border-white/10 hover:bg-white/5"}
              onClick={() => { setFilter(cat.slug); setVisibleCount(ITEMS_PER_PAGE); }}
            >
              {cat.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-mono">
          No projects found matching the selected filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel overflow-hidden group relative aspect-[4/3] rounded-xl border border-white/10"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-display font-bold text-lg">{item.title}</h3>
                    <span className="text-primary text-sm font-mono">{item.categoryTitle}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="mt-16 flex justify-center">
              <Button 
                onClick={handleLoadMore}
                variant="outline" 
                className="border-primary/50 text-primary hover:bg-primary hover:text-black font-mono uppercase tracking-widest px-8 py-6 rounded-none no-default-hover-elevate shadow-[0_0_10px_rgba(0,240,255,0.2)]"
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

          {hasMore && (
            <div className="mt-16 flex justify-center">
              <Button 
                onClick={handleLoadMore}
                variant="outline" 
                className="border-primary/50 text-primary hover:bg-primary hover:text-black font-mono uppercase tracking-widest px-8 py-6 rounded-none no-default-hover-elevate shadow-[0_0_10px_rgba(0,240,255,0.2)]"
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
