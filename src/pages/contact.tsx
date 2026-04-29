import { motion } from "framer-motion";
import { contact } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { getSocialIcon } from "@/components/icon-map";
import { Button } from "@/components/ui/button";

export default function Contact() {
  useDocumentMeta("Contact");

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          {contact.available && (
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full font-mono text-sm mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available for new engagements
            </div>
          )}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] glitch-hover">
            {contact.heading}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {contact.subheading}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT PANEL: CONTENT & PRIMARY BUTTONS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 md:p-12 border-white/10 relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            
            <div className="prose prose-invert prose-p:text-muted-foreground mb-12 flex-1">
              <div dangerouslySetInnerHTML={{ __html: contact.bodyHtml }} />
            </div>

            <div className="space-y-4">
              <a href={`mailto:${contact.email}`} className="block">
                <Button className="group relative w-full bg-white text-black hover:bg-white/90 font-bold text-lg py-6 rounded-none no-default-hover-elevate overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10">Email Me</span>
                </Button>
              </a>
              
              {contact.bookingUrl && (
                <a href={contact.bookingUrl} target="_blank" rel="noreferrer" className="block mt-4">
                  <Button variant="outline" className="group relative w-full border-primary text-primary hover:bg-primary hover:text-black font-bold text-lg py-6 rounded-none no-default-hover-elevate shadow-[0_0_15px_rgba(0,240,255,0.1)] overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    <span className="relative z-10">Book an Intro Call</span>
                  </Button>
                </a>
              )}
            </div>
          </motion.div>

          {/* RIGHT PANEL: SOCIAL LINKS & DIRECT LINES */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="glass-panel p-8 border-white/5 flex-1">
              <h3 className="font-mono text-sm uppercase tracking-widest text-primary mb-6 border-b border-white/10 pb-4">Digital Presence</h3>
              
              <div className="flex flex-col gap-3">
                {contact.socials.map((social) => {
                  const Icon = getSocialIcon(social.platform);
                  return (
                    <a 
                      key={social.platform} 
                      href={social.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group relative flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                      
                      <div className="flex items-center gap-4 relative z-10 w-full min-w-0">
                        <div className="p-2 bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors duration-300 flex-shrink-0">
                          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <div className="min-w-0 flex-1 pr-4">
                          <div className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-300">
                            {social.label}
                          </div>
                          {social.handle && (
                            <div className="text-xs font-mono text-muted-foreground truncate w-full">
                              {social.handle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative z-10 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {(contact.location || contact.phone) && (
              <div className="glass-panel p-8 border-white/5">
                <h3 className="font-mono text-sm uppercase tracking-widest text-secondary mb-6 border-b border-white/10 pb-4">Direct Lines</h3>
                <div className="space-y-4 font-mono text-sm">
                  {contact.location && (
                    <div className="flex justify-between">
                      <span className="text-white/40">HQ</span>
                      <span className="text-white text-right">{contact.location}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex justify-between">
                      <span className="text-white/40">COMMS</span>
                      <span className="text-white">{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
