import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, Recycle, Zap, TreePine, Cpu, Sparkles } from "lucide-react";

const FLOATING_ICONS = [
  { icon: Recycle, color: "text-emerald-400", bg: "bg-emerald-400/15", x: "8%",  y: "25%", size: "w-14 h-14", delay: 0,   duration: 5 },
  { icon: Leaf,    color: "text-teal-400",    bg: "bg-teal-400/15",    x: "88%", y: "20%", size: "w-10 h-10", delay: 1,   duration: 6 },
  { icon: Zap,     color: "text-amber-400",   bg: "bg-amber-400/15",   x: "80%", y: "70%", size: "w-12 h-12", delay: 0.5, duration: 4.5 },
  { icon: TreePine,color: "text-green-400",   bg: "bg-green-400/15",   x: "5%",  y: "70%", size: "w-11 h-11", delay: 1.5, duration: 5.5 },
  { icon: Cpu,     color: "text-blue-400",    bg: "bg-blue-400/15",    x: "50%", y: "8%",  size: "w-9 h-9",   delay: 0.8, duration: 6.5 },
  { icon: Sparkles,color: "text-purple-400",  bg: "bg-purple-400/15",  x: "92%", y: "50%", size: "w-9 h-9",   delay: 2,   duration: 4 },
];

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 5 + 2,
  x: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 5,
  opacity: Math.random() * 0.5 + 0.1,
}));

const STATS = [
  { value: "10K+",  label: "Usuários Ativos",  color: "from-emerald-500 to-teal-500",    bg: "bg-emerald-50", icon: "👤" },
  { value: "50T",   label: "Lixo Reciclado",   color: "from-blue-500 to-cyan-500",       bg: "bg-blue-50",    icon: "♻️" },
  { value: "200+",  label: "Ecopontos",         color: "from-amber-500 to-orange-500",    bg: "bg-amber-50",   icon: "📍" },
  { value: "25T",   label: "CO₂ Evitado (kg)", color: "from-purple-500 to-pink-500",     bg: "bg-purple-50",  icon: "🌿" },
];

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden min-h-screen flex flex-col justify-center">

      {/* === ANIMATED BACKGROUND === */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900" />

        {/* Mesh blobs */}
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-emerald-600/20 rounded-full blur-[120px] animate-blob" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px] animate-blob delay-1000" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[100px] animate-blob delay-2000" />
          <div className="absolute top-1/4 left-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] animate-blob delay-3000" />
        </motion.div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,30,15,0.7)_100%)]" />

        {/* Particles */}
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-emerald-300"
            style={{
              width: p.size, height: p.size,
              left: `${p.x}%`, bottom: '-10px',
              opacity: p.opacity,
              animation: `particle-rise ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* === FLOATING ICONS === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_ICONS.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              className={`absolute ${f.size} rounded-2xl ${f.bg} border border-white/10 flex items-center justify-center backdrop-blur-sm`}
              style={{ left: f.x, top: f.y }}
              animate={{
                y: [0, -18, 0],
                rotate: [0, i % 2 === 0 ? 8 : -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className={`${f.color} w-1/2 h-1/2`} />
            </motion.div>
          );
        })}
      </div>

      {/* === MAIN CONTENT === */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Plataforma de Sustentabilidade Digital
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-500" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-outfit font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight mb-6 leading-[0.9]"
        >
          <span className="text-white">GO</span>
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #34d399, #22c55e, #06b6d4, #3b82f6)',
              backgroundSize: '300% 300%',
              animation: 'gradient-shift 4s ease infinite',
            }}
          >
            -ECO
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-2xl md:text-3xl font-outfit font-light text-emerald-200/90 mb-4"
        >
          Vencer com sustentabilidade
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-base md:text-lg text-emerald-200/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Promovemos uma nova cultura de descarte consciente, conectando tecnologia,
          educação ambiental e incentivo social para tornar a sustentabilidade parte do seu dia a dia.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/comunidade"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white shadow-glow-green transition-all"
              style={{ background: 'linear-gradient(135deg, #22c55e, #10b981, #06b6d4)', backgroundSize: '200%', animation: 'gradient-shift 4s ease infinite' }}
            >
              Começar Agora <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all"
            >
              📍 Ver Ecopontos
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center group cursor-default"
            >
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <p
                className="font-outfit font-black text-2xl md:text-3xl text-transparent bg-clip-text mb-1"
                style={{ backgroundImage: `linear-gradient(135deg, ${i % 2 === 0 ? '#34d399, #06b6d4' : '#818cf8, #ec4899'})` }}
              >
                {s.value}
              </p>
              <p className="text-emerald-200/60 text-xs">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-col items-center gap-2 text-emerald-200/40"
        >
          <span className="text-xs">Role para explorar</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border border-emerald-400/30 rounded-full flex items-start justify-center pt-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
