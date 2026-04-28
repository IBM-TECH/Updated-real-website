import { motion } from "framer-motion";
import { about } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { getLucideIcon } from "@/components/icon-map";
import { Progress } from "@/components/ui/progress";

export default function About() {
  useDocumentMeta("About");

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-7 lg:col-span-8 order-2 md:order-1"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 glitch-hover drop-shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              {about.heading}
            </h1>
            <p className="text-xl text-primary font-mono mb-8 border-l-2 border-primary/50 pl-4">
              {about.subheading}
            </p>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-a:text-secondary max-w-none text-lg leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: about.bodyHtml }} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-5 lg:col-span-4 order-1 md:order-2"
          >
            <div className="glass-panel p-2 rotate-2 hover:rotate-0 transition-transform duration-500 neon-glow">
              <ImageWithFallback 
                src={about.portrait} 
                slug="portrait" 
                className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {[
            { label: "Years Exp", value: about.yearsExperience },
            { label: "Projects", value: about.projectsCompleted },
            { label: "Clients", value: about.happyClients },
            { label: "Awards", value: about.awards },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-8 flex flex-col items-center justify-center text-center group border-white/5 hover:border-secondary/50 transition-colors">
              <div className="text-4xl md:text-5xl font-display font-black text-white mb-2 group-hover:text-secondary transition-colors drop-shadow-[0_0_10px_rgba(255,0,229,0.5)]">
                {stat.value}+
              </div>
              <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Skills */}
        <div className="mb-24">
          <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-4">
            Technical Arsenal
            <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {about.skills.map((skill, i) => {
              const Icon = getLucideIcon(skill.icon);
              return (
                <motion.div 
                  key={skill.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="font-bold text-white">{skill.name}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded">{skill.category}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-12 flex items-center gap-4">
            Career Log
            <div className="h-[1px] flex-1 bg-gradient-to-r from-secondary/50 to-transparent" />
          </h2>

          <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 md:pl-8 space-y-12">
            {about.timeline.map((item, i) => {
              const isWork = item.type === "work";
              const isEdu = item.type === "education";
              const colorClass = isWork ? "text-primary" : isEdu ? "text-accent" : "text-secondary";
              const bgClass = isWork ? "bg-primary" : isEdu ? "bg-accent" : "bg-secondary";
              const shadowClass = isWork ? "shadow-[0_0_10px_rgba(0,240,255,0.8)]" : isEdu ? "shadow-[0_0_10px_rgba(168,85,247,0.8)]" : "shadow-[0_0_10px_rgba(255,0,229,0.8)]";

              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative pl-8 md:pl-0"
                >
                  <div className={`absolute -left-[41px] md:-left-[41px] top-1.5 w-4 h-4 rounded-full ${bgClass} ${shadowClass} border-2 border-black`} />
                  
                  <div className="glass-panel p-6 border-white/5 hover:border-white/20 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                      <span className={`font-mono font-bold text-lg ${colorClass}`}>{item.year}</span>
                      <h3 className="text-xl font-display font-bold text-white">{item.title}</h3>
                    </div>
                    {item.organization && (
                      <div className="text-sm font-mono text-white/50 mb-3 bg-white/5 inline-block px-3 py-1 rounded">
                        {item.organization}
                      </div>
                    )}
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
