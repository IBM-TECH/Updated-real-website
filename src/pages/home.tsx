import { Link } from "wouter";
import { motion } from "framer-motion";
import { siteSettings, featuredItems, about } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PortfolioCard } from "@/components/portfolio-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  useDocumentMeta();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="text-primary font-mono tracking-widest text-sm md:text-base mb-4 uppercase">
                {siteSettings.tagline}
              </h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-tight mb-6 glitch-hover drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                {siteSettings.artistName.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10 border-l-2 border-primary/50 pl-6">
                {siteSettings.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/portfolio">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg rounded-none relative overflow-hidden group no-default-hover-elevate">
                    <span className="relative z-10 flex items-center gap-2">View Work <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/20 hover:border-white text-white bg-transparent hover:bg-white/5 font-bold px-8 py-6 text-lg rounded-none no-default-hover-elevate">
                    Get in touch
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Featured Work */}
      <section className="py-24 relative z-10 bg-black/40 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Featured Work</h2>
              <div className="h-1 w-20 bg-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            </div>
            <Link href="/portfolio" className="hidden md:flex text-primary hover:text-white font-mono text-sm items-center gap-2 transition-colors group">
              All Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.slice(0, 6).map((item, i) => (
              <PortfolioCard key={item.slug} item={item} index={i} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/portfolio">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-black">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold text-white mb-6">{about.heading}</h2>
              <p className="text-xl text-primary font-mono mb-6">{about.subheading}</p>
              <div className="prose prose-invert prose-p:text-muted-foreground prose-a:text-secondary max-w-none mb-8 line-clamp-4">
                <div dangerouslySetInnerHTML={{ __html: about.bodyHtml }} />
              </div>
              <Link href="/about">
                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-none no-default-hover-elevate shadow-[0_0_15px_rgba(255,0,229,0.3)]">
                  More about me
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "Years Exp", value: about.yearsExperience },
                { label: "Projects", value: about.projectsCompleted },
                { label: "Clients", value: about.happyClients },
                { label: "Awards", value: about.awards },
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-6 border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl md:text-5xl font-display font-black text-white mb-2 neon-glow">{stat.value}+</div>
                  <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
