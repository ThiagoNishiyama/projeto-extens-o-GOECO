import React from "react";
import { motion } from "framer-motion";
import { Recycle, MapPin, Trophy, Users, Smartphone, Cpu } from "lucide-react";

const features = [
  {
    icon: MapPin, title: "Ecopontos Inteligentes",
    desc: "Pontos de coleta com sensores que monitoram capacidade em tempo real",
    color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", border: "hover:border-emerald-300/50",
    glow: "hover:shadow-glow-green", dot: "bg-emerald-400",
  },
  {
    icon: Trophy, title: "Gamificação",
    desc: "Ganhe pontos e recompensas a cada descarte. Suba de nível e conquiste badges!",
    color: "from-amber-500 to-orange-500", bg: "bg-amber-50", border: "hover:border-amber-300/50",
    glow: "hover:shadow-glow-amber", dot: "bg-amber-400",
  },
  {
    icon: Users, title: "Comunidade Ativa",
    desc: "Conecte-se com pessoas que compartilham do mesmo propósito sustentável",
    color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", border: "hover:border-blue-300/50",
    glow: "hover:shadow-glow-blue", dot: "bg-blue-400",
  },
  {
    icon: Recycle, title: "Negociação P2P",
    desc: "Negocie materiais eletrônicos diretamente com empresas e pessoas",
    color: "from-purple-500 to-pink-500", bg: "bg-purple-50", border: "hover:border-purple-300/50",
    glow: "hover:shadow-glow-purple", dot: "bg-purple-400",
  },
  {
    icon: Smartphone, title: "QR Code Pessoal",
    desc: "Escaneie nos ecopontos e receba seus pontos automaticamente no app",
    color: "from-rose-500 to-red-500", bg: "bg-rose-50", border: "hover:border-rose-300/50",
    glow: "", dot: "bg-rose-400",
  },
  {
    icon: Cpu, title: "Sensores IoT",
    desc: "Tecnologia de ponta para monitoramento inteligente dos ecopontos",
    color: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", border: "hover:border-indigo-300/50",
    glow: "", dot: "bg-indigo-400",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.3 } },
};

export default function SolutionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4 border border-emerald-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            A Solução
          </motion.div>
          <h2 className="font-outfit font-bold text-3xl md:text-5xl mb-4">
            Como o <span className="text-gradient">GO-ECO</span> funciona
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Uma plataforma completa que torna o descarte de eletrônicos fácil, divertido e recompensador.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`group relative bg-white border border-border/60 rounded-3xl p-7 transition-all duration-300 cursor-default overflow-hidden ${f.border} ${f.glow}`}
            >
              {/* Corner glow */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl`} />

              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-7 h-7 text-white" />
                {/* Orbiting dot */}
                <span className={`absolute -top-1 -right-1 w-3 h-3 ${f.dot} rounded-full border-2 border-white animate-ping-slow`} />
              </div>

              <h3 className="font-outfit font-bold text-lg mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
