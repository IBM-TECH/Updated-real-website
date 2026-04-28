import { Link } from "wouter";
import { motion } from "framer-motion";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  useDocumentMeta("404");

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-12 max-w-lg w-full text-center border-destructive/30 shadow-[0_0_30px_rgba(255,0,0,0.1)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive animate-pulse" />
        
        <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
        
        <h1 className="text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-2 glitch-hover drop-shadow-md">
          404
        </h1>
        
        <h2 className="text-2xl font-mono text-destructive mb-6 uppercase tracking-widest">
          Signal Lost
        </h2>
        
        <p className="text-muted-foreground mb-8">
          The requested coordinate does not exist in this sector. The node may have been moved, deleted, or you're experiencing a systemic glitch.
        </p>
        
        <Link href="/">
          <Button className="w-full sm:w-auto bg-white hover:bg-white/90 text-black font-bold font-mono uppercase tracking-wider rounded-none no-default-hover-elevate">
            <Home className="w-4 h-4 mr-2" />
            Return to Core
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
