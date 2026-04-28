import { Link } from "wouter";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./image-with-fallback";
import { getCategory } from "@/lib/content";
import { getLucideIcon } from "./icon-map";
import type { PortfolioItem } from "@/lib/types";

export function PortfolioCard({ item, index = 0 }: { item: PortfolioItem, index?: number }) {
  const category = getCategory(item.category);
  const Icon = getLucideIcon(category?.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/work/${item.slug}`} className="group block relative rounded-lg overflow-hidden glass-panel border-white/10 hover:border-primary/50 transition-colors duration-500 neon-glow no-default-hover-elevate">
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <ImageWithFallback 
            src={item.cover} 
            slug={item.slug} 
            className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md">
                <Icon className="w-3 h-3" />
                {category?.title || item.category}
              </span>
              {item.medium && (
                <span className="bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded text-xs font-mono uppercase backdrop-blur-md">
                  {item.medium}
                </span>
              )}
            </div>
            <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">{item.title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
