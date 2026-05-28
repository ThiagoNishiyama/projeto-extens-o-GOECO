import React from "react";
import { motion } from "framer-motion";
import { Leaf, Gift, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Leaf, title: "Sustentabilidade Real",
    desc: "Cada descarte correto contribui para um planeta mais limpo. Acompanhe seu impacto ambiental em CO₂, água e energia.",
    gradient: "from-emerald-500 to-teal-500", light: "bg-emerald-50", border: "border-emerald-100",
    stat: "25T CO₂", statLabel: "evitados por mês",
    emoji: "🌿",
  },
  {
    icon: Gift, title: "Recompensas Reais",
    desc: "Ganhe pontos, suba de nível e troque por benefícios reais. Sustentabilidade que literalmente recompensa.",
    gradient: "from-blue-500 to-cyan-400", light: "bg-blue-50", border: "border-blue-100",
    stat: "10K+", statLabel: "pontos distribuídos",
    emoji: "🎁",
  },
  {
    icon: Heart, title: "Comunidade Vibrante",
    desc: "Faça parte de uma rede de pessoas engajadas. Compartilhe conquistas, inspire e seja inspirado todos os dias.",
    gradient: "from-purple-500 to-pink-500", light: "bg-purple-50", border: "border-purple-100",
    stat: "500+", statLabel: "membros ativos",
    emoji: "💜",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-emerald-50/30 to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Por que participar?
          </div>
          <h2 className="font-outfit font-bold text-3xl md:text-5xl mb-4">
            Benefícios que <span className="text-gradient">fazem diferença</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Mais do que reciclar — é uma experiência completa de impacto, recompensa e comunidade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-7">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative group bg-white border ${b.border} rounded-3xl p-8 text-center overflow-hidden cursor-default transition-all duration-300 hover:shadow-card-lift`}
            >
              {/* Background bloom */}
              <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${b.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`} />

              {/* Emoji */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                className="text-4xl mb-4 inline-block"
              >
                {b.emoji}
              </motion.div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <b.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-outfit font-bold text-xl mb-3">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm mb-6">{b.desc}</p>

              {/* Stat chip */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${b.light} border ${b.border}`}>
                <span className={`font-outfit font-bold text-transparent bg-clip-text bg-gradient-to-r ${b.gradient}`}>
                  {b.stat}
                </span>
                <span className="text-xs text-muted-foreground">{b.statLabel}</span>
              </div>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-10 text-center text-white"
          style={{ backgroundSize: '200%', animation: 'gradient-shift 6s ease infinite' }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
            <h3 className="font-outfit font-black text-2xl md:text-3xl mb-3">
              Pronto para fazer parte da mudança? 🌱
            </h3>
            <p className="text-emerald-100/80 mb-7 max-w-lg mx-auto">
              Junte-se a milhares de pessoas que já estão transformando o descarte de eletrônicos em impacto positivo.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/comunidade"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-2xl font-semibold text-base hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Começar Agora <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
