import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { siteSettings, featuredItems, about } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PortfolioCard } from "@/components/portfolio-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// ── Animated paint-stroke canvas background ──────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "rgba(0,255,247,",
      "rgba(255,0,229,",
      "rgba(168,85,247,",
      "rgba(0,200,255,",
    ];

    interface Stroke {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      size: number; color: string;
      angle: number; angleV: number;
    }

    const strokes: Stroke[] = [];

    const spawn = (): Stroke => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      life: 0,
      maxLife: 180 + Math.random() * 220,
      size: 60 + Math.random() * 120,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * Math.PI * 2,
      angleV: (Math.random() - 0.5) * 0.012,
    });

    for (let i = 0; i < 18; i++) {
      const s = spawn();
      s.life = Math.random() * s.maxLife;
      strokes.push(s);
    }

    const drawStroke = (s: Stroke) => {
      const alpha = Math.sin((s.life / s.maxLife) * Math.PI) * 0.18;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s.size);
      grd.addColorStop(0, s.color + alpha + ")");
      grd.addColorStop(0.5, s.color + (alpha * 0.5) + ")");
      grd.addColorStop(1, s.color + "0)");
      ctx.scale(1, 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, s.size, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    };

    interface Dot {
      x: number; y: number; vx: number; vy: number;
      r: number; color: string; alpha: number; life: number; maxLife: number;
    }
    const dots: Dot[] = [];
    const spawnDot = (): Dot => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      r: 1.5 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0,
      life: 0,
      maxLife: 120 + Math.random() * 150,
    });

    for (let i = 0; i < 40; i++) {
      const d = spawnDot();
      d.life = Math.random() * d.maxLife;
      dots.push(d);
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of strokes) {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.angle += s.angleV;
        if (s.life >= s.maxLife) Object.assign(s, spawn());
        drawStroke(s);
      }

      for (const d of dots) {
        d.life++;
        d.x += d.vx;
        d.y += d.vy;
        d.alpha = Math.sin((d.life / d.maxLife) * Math.PI) * 0.7;
        if (d.life >= d.maxLife) Object.assign(d, spawnDot());
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color + d.alpha + ")";
        ctx.fill();
      }

      // subtle grid
      ctx.strokeStyle = "rgba(0,255,247,0.025)";
      ctx.lineWidth = 1;
      const gap = 60;
      for (let x = 0; x < canvas.width; x += gap) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gap) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Team members — edit names, roles, bios & image paths here ────────────────
const TEAM = [
  {
    name: "Luqqss Temmy",
    role: "Lead Artist & Creative Director",
    bio: "Specialist in 2D & 3D character design. Bringing your ideas to life with bold, high-quality visuals.",
    image: "", // e.g. /uploads/luqqss.jpg
    initials: "LT",
  },
  {
    name: "Team Member",
    role: "Art Production & Commissions",
    bio: "Focused on delivering high-quality commission work with fast turnaround and close client collaboration.",
    image: "", // e.g. /uploads/member2.jpg
    initials: "TM",
  },
];

export default function Home() {
  useDocumentMeta();

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100vh] flex items-center pt-16 overflow-hidden">
        <HeroCanvas />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

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

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-14">
                <Link href="/portfolio">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg rounded-none relative overflow-hidden group no-default-hover-elevate">
                    <span className="relative z-10 flex items-center gap-2">
                      View Work <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/20 hover:border-white text-white bg-transparent hover:bg-white/5 font-bold px-8 py-6 text-lg rounded-none no-default-hover-elevate">
                    Get in touch
                  </Button>
                </Link>
              </div>

              {/* ── Team Cards ─────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
              >
                <p className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-4">
                  Meet the team
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {TEAM.map((member, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.75 + i * 0.15 }}
                      className="flex items-center gap-4 bg-black/50 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-300 px-5 py-4 flex-1"
                    >
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full border-2 border-primary/50 overflow-hidden flex-shrink-0 shadow-[0_0_14px_rgba(0,240,255,0.35)]">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-display font-black text-lg">
                            {member.initials}
                          </div>
                        )}
                      </div>
                      {/* Details */}
                      <div className="min-w-0">
                        <p className="text-white font-display font-bold text-sm leading-tight truncate">
                          {member.name}
                        </p>
                        <p className="text-primary font-mono text-xs mb-1 truncate">{member.role}</p>
                        <p className="text-muted-foreground text-xs leading-snug line-clamp-2">
                          {member.bio}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* ── Featured Work ────────────────────────────────────────────────────── */}
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

      {/* ── About Teaser ─────────────────────────────────────────────────────── */}
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

