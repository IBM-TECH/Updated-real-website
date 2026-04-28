import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

interface LightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

function extractVideoId(url: string, type: "youtube" | "vimeo"): string {
  if (!url) return "";
  if (!url.includes("/") && !url.includes("http")) return url;
  
  try {
    if (type === "youtube") {
      const u = new URL(url);
      return u.searchParams.get("v") || u.pathname.split("/").pop() || url;
    } else {
      const u = new URL(url);
      return u.pathname.split("/").pop() || url;
    }
  } catch (e) {
    return url;
  }
}

export function GalleryLightbox({ items, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, items.length]);

  const currentItem = items[currentIndex];

  if (!items.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[100vw] h-[100dvh] p-0 bg-black/95 border-none rounded-none flex items-center justify-center">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white/50 hover:text-white p-2 rounded-full glass-panel transition-all">
          <X className="w-6 h-6" />
        </button>

        {items.length > 1 && (
          <>
            <button onClick={handlePrev} className="absolute left-4 z-50 text-white/50 hover:text-white p-4 rounded-full glass-panel transition-all hover:scale-110">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={handleNext} className="absolute right-4 z-50 text-white/50 hover:text-white p-4 rounded-full glass-panel transition-all hover:scale-110">
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        <div className="relative w-full h-full flex items-center justify-center p-12" onClick={onClose}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-6xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentItem.type === "image" && (
                <img src={currentItem.src} alt={currentItem.alt || "Gallery image"} className="max-w-full max-h-[85vh] object-contain shadow-2xl shadow-primary/10" loading="lazy" />
              )}
              {currentItem.type === "video" && (
                <video src={currentItem.src} controls autoPlay muted loop className="max-w-full max-h-[85vh] object-contain shadow-2xl shadow-primary/10" />
              )}
              {currentItem.type === "youtube" && currentItem.url && (
                <iframe 
                  src={`https://www.youtube.com/embed/${extractVideoId(currentItem.url, "youtube")}?autoplay=1`} 
                  className="w-full aspect-video max-h-[85vh] shadow-2xl shadow-primary/10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              {currentItem.type === "vimeo" && currentItem.url && (
                <iframe 
                  src={`https://player.vimeo.com/video/${extractVideoId(currentItem.url, "vimeo")}?autoplay=1`} 
                  className="w-full aspect-video max-h-[85vh] shadow-2xl shadow-primary/10"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full font-mono text-sm text-white/70">
            {currentIndex + 1} / {items.length}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
