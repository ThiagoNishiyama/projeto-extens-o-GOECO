import React from "react";
import { motion } from "framer-motion";
import { Leaf, Gift, Heart } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "Sustentabilidade",
    desc: "Cada descarte correto contribui para um planeta mais limpo e saudável. Acompanhe seu impacto real.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Gift,
    title: "Recompensas",
    desc: "Ganhe pontos, suba de nível e troque por benefícios reais. Sustentabilidade que recompensa.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Heart,
    title: "Comunidade",
    desc: "Faça parte de uma rede de pessoas engajadas. Compartilhe, inspire e seja inspirado.",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Benefícios</span>
          <h2 className="font-space font-bold text-3xl md:text-4xl mt-3">
            Por que participar?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                <b.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}