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
              <a href={`mailto:${contact.email}`}>
                <Button className="w-full bg-white text-black hover:bg-white/90 font-bold text-lg py-6 rounded-none no-default-hover-elevate">
                  Email Me
                </Button>
              </a>
              {contact.bookingUrl && (
                <a href={contact.bookingUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-black font-bold text-lg py-6 rounded-none no-default-hover-elevate shadow-[0_0_15px_rgba(0,240,255,0.1)] mt-4">
                    Book an Intro Call
                  </Button>
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="glass-panel p-8 border-white/5 flex-1">
              <h3 className="font-mono text-sm uppercase tracking-widest text-primary mb-6 border-b border-white/10 pb-4">Digital Presence</h3>
              <div className="grid grid-cols-2 gap-4">
                {contact.socials.map((social) => {
                  const Icon = getSocialIcon(social.platform);
                  return (
                    <a 
                      key={social.platform} 
                      href={social.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                      <div>
                        <div className="text-sm font-bold text-white">{social.label}</div>
                        {social.handle && <div className="text-xs font-mono text-muted-foreground">{social.handle}</div>}
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
