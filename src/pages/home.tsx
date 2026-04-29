import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { siteSettings, featuredItems, about } from "@/lib/content";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PortfolioCard } from "@/components/portfolio-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TEAM DATA — edit names, roles, bios and image paths here
// ─────────────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: "Luqqss Temmy",
    role: "Lead Artist & Creative Director",
    bio: "Specialist in 2D & 3D character design with a passion for bold, expressive visuals. Every piece is crafted with precision and soul — bringing your ideas to life.",
    image: "", // paste your uploaded image path here e.g. /uploads/luqqss.jpg
    initials: "LT",
    accent: "#00fff7",
  },
  {
    name: "Team Member",
    role: "Art Production & Commissions",
    bio: "Dedicated to delivering high-quality commission work with fast turnaround. Close collaboration with every client to ensure the final result exceeds expectations.",
    image: "", // paste your uploaded image path here e.g. /uploads/member2.jpg
    initials: "TM",
    accent: "#ff00e5",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAINT EXPLOSION CANVAS — the hero background
// ─────────────────────────────────────────────────────────────────────────────
function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const PALETTE = ["#00fff7", "#ff00e5", "#a855f7", "#00c8ff", "#ff6b00"];

    // ── Splash blob ──────────────────────────────────────────────────────────
    interface Splash {
      x: number; y: number;
      r: number; maxR: number;
      color: string; alpha: number;
      growing: boolean; age: number; maxAge: number;
      points: { angle: number; dist: number }[];
    }

    const splashes: Splash[] = [];
    let splashTimer = 0;

    const createSplash = () => {
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const pts = Array.from({ length: 14 }, () => ({
        angle: Math.random() * Math.PI * 2,
        dist: 0.6 + Math.random() * 0.7,
      })).sort((a, b) => a.angle - b.angle);

      splashes.push({
        x: 80 + Math.random() * (canvas.width - 160),
        y: 80 + Math.random() * (canvas.height - 160),
        r: 0,
        maxR: 60 + Math.random() * 110,
        color,
        alpha: 0.55 + Math.random() * 0.3,
        growing: true,
        age: 0,
        maxAge: 280 + Math.random() * 180,
        points: pts,
      });
    };

    const drawSplash = (s: Splash) => {
      const progress = s.age / s.maxAge;
      const fadeAlpha = s.alpha * Math.sin(progress * Math.PI);
      if (fadeAlpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = fadeAlpha;

      // Outer glow
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 1.8);
      glow.addColorStop(0, s.color + "55");
      glow.addColorStop(1, s.color + "00");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Blob shape
      ctx.beginPath();
      const pts = s.points;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const nx = s.x + Math.cos(p.angle) * s.r * p.dist;
        const ny = s.y + Math.sin(p.angle) * s.r * p.dist;
        if (i === 0) ctx.moveTo(nx, ny);
        else ctx.lineTo(nx, ny);
      }
      ctx.closePath();
      const blobGrd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      blobGrd.addColorStop(0, s.color + "ff");
      blobGrd.addColorStop(0.6, s.color + "cc");
      blobGrd.addColorStop(1, s.color + "44");
      ctx.fillStyle = blobGrd;
      ctx.fill();

      ctx.restore();
    };

    // ── Ink drip ─────────────────────────────────────────────────────────────
    interface Drip {
      x: number; y: number; vy: number;
      len: number; color: string; alpha: number; age: number; maxAge: number;
    }
    const drips: Drip[] = [];

    const createDrip = (sx: number, sy: number, color: string) => {
      for (let i = 0; i < 3 + Math.floor(Math.random() * 4); i++) {
        drips.push({
          x: sx + (Math.random() - 0.5) * 60,
          y: sy + Math.random() * 30,
          vy: 0.5 + Math.random() * 1.8,
          len: 20 + Math.random() * 60,
          color,
          alpha: 0.5 + Math.random() * 0.4,
          age: 0,
          maxAge: 150 + Math.random() * 120,
        });
      }
    };

    const drawDrip = (d: Drip) => {
      const p = d.age / d.maxAge;
      const a = d.alpha * (1 - p);
      if (a <= 0) return;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 2 + (1 - p) * 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.len * Math.min(p * 3, 1));
      ctx.stroke();
      // drip dot at bottom
      ctx.beginPath();
      ctx.arc(d.x, d.y + d.len * Math.min(p * 3, 1), ctx.lineWidth * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
      ctx.restore();
    };

    // ── Spark particles ───────────────────────────────────────────────────────
    interface Spark {
      x: number; y: number; vx: number; vy: number;
      r: number; color: string; alpha: number; life: number; maxLife: number;
    }
    const sparks: Spark[] = [];

    const createSparks = (sx: number, sy: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2.5;
        sparks.push({
          x: sx, y: sy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          r: 1.5 + Math.random() * 3,
          color,
          alpha: 0.9,
          life: 0,
          maxLife: 60 + Math.random() * 60,
        });
      }
    };

    // ── Floating ambient particles ────────────────────────────────────────────
    interface Ambient {
      x: number; y: number; vx: number; vy: number;
      r: number; color: string; alpha: number; life: number; maxLife: number;
    }
    const ambient: Ambient[] = Array.from({ length: 60 }, () => {
      const maxLife = 180 + Math.random() * 200;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.35,
        r: 1 + Math.random() * 2.5,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        alpha: 0,
        life: Math.random() * maxLife,
        maxLife,
      };
    });

    // ── Scan grid ────────────────────────────────────────────────────────────
    let gridPulse = 0;

    // ── Main loop ────────────────────────────────────────────────────────────
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle vignette bg
      const bg = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      bg.addColorStop(0, "rgba(10,5,20,0)");
      bg.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pulsing grid
      gridPulse += 0.015;
      const gridAlpha = 0.03 + Math.sin(gridPulse) * 0.015;
      ctx.strokeStyle = `rgba(0,255,247,${gridAlpha})`;
      ctx.lineWidth = 1;
      const gap = 55;
      for (let x = 0; x < canvas.width; x += gap) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gap) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Spawn splashes on timer
      splashTimer++;
      if (splashTimer > 55 && splashes.length < 10) {
        const s = createSplash() as unknown as Splash;
        // createSplash pushes to array — get last
        const newS = splashes[splashes.length - 1];
        createDrip(newS.x, newS.y + newS.maxR * 0.5, newS.color);
        createSparks(newS.x, newS.y, newS.color);
        splashTimer = 0;
      }

      // Draw & age splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.age++;
        if (s.growing) {
          s.r += (s.maxR - s.r) * 0.06;
          if (s.r >= s.maxR * 0.95) s.growing = false;
        }
        drawSplash(s);
        if (s.age >= s.maxAge) splashes.splice(i, 1);
      }

      // Draw & age drips
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];
        d.age++;
        d.y += d.vy;
        drawDrip(d);
        if (d.age >= d.maxAge) drips.splice(i, 1);
      }

      // Draw & age sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.04; // gravity
        sp.alpha = (1 - sp.life / sp.maxLife) * 0.8;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        if (sp.life >= sp.maxLife) sparks.splice(i, 1);
      }

      // Ambient particles
      for (const p of ambient) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.65;
        if (p.life >= p.maxLife) {
          Object.assign(p, {
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            life: 0,
            maxLife: 180 + Math.random() * 200,
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          });
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(tick);
    };

    // Kick off with a few immediate splashes
    for (let i = 0; i < 4; i++) createSplash();

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  useDocumentMeta();

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100vh] flex items-center pt-16 overflow-hidden">
        <PaintCanvas />

        {/* Gradient overlays to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-primary font-mono tracking-widest text-sm md:text-base mb-4 uppercase"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {siteSettings.tagline}
              </motion.h2>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-tight mb-6 glitch-hover drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                {siteSettings.artistName.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    className="block"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10 border-l-4 border-primary/70 pl-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {siteSettings.heroSubtitle}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Link href="/portfolio">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-black px-10 py-7 text-lg rounded-none relative overflow-hidden group no-default-hover-elevate shadow-[0_0_30px_rgba(0,255,247,0.4)]">
                    <span className="relative z-10 flex items-center gap-2">
                      View Work <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/25 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/30 hover:border-primary text-white bg-transparent hover:bg-primary/10 font-bold px-10 py-7 text-lg rounded-none no-default-hover-elevate transition-all duration-300">
                    Get in touch
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-primary/70">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* ── TEAM SECTION ─────────────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 bg-black/60 backdrop-blur-md border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono text-primary/60 uppercase tracking-[0.3em] mb-3">The people behind the work</p>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">Meet the Team</h2>
            <div className="h-1 w-16 bg-secondary shadow-[0_0_10px_rgba(255,0,229,0.5)] mx-auto mt-4" />
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-10 md:gap-20">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center max-w-xs mx-auto"
              >
                {/* Avatar ring + image */}
                <div
                  className="relative w-36 h-36 mb-6"
                  style={{ filter: `drop-shadow(0 0 18px ${member.accent}66)` }}
                >
                  {/* Spinning ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(${member.accent}, transparent, ${member.accent})`,
                      padding: "2px",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Avatar */}
                  <div
                    className="absolute inset-[3px] rounded-full overflow-hidden bg-black flex items-center justify-center border-2"
                    style={{ borderColor: member.accent + "33" }}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-display font-black text-4xl"
                        style={{
                          background: `radial-gradient(circle at center, ${member.accent}22, transparent)`,
                          color: member.accent,
                        }}
                      >
                        {member.initials}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name + Role */}
                <h3 className="text-xl font-display font-black text-white mb-1">{member.name}</h3>
                <p
                  className="font-mono text-xs uppercase tracking-widest mb-4"
                  style={{ color: member.accent }}
                >
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ────────────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 bg-black/40 backdrop-blur-sm border-b border-white/5">
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


