import React from "react";
import { motion } from "framer-motion";
import { Recycle, MapPin, Trophy, Users, Smartphone, Cpu } from "lucide-react";

const features = [
  { icon: MapPin, title: "Ecopontos Inteligentes", desc: "Pontos de coleta com sensores que monitoram capacidade em tempo real" },
  { icon: Trophy, title: "Gamificação", desc: "Ganhe pontos e recompensas a cada descarte. Suba de nível!" },
  { icon: Users, title: "Comunidade Ativa", desc: "Conecte-se com pessoas que compartilham do mesmo propósito" },
  { icon: Recycle, title: "Negociação P2P", desc: "Negocie materiais eletrônicos diretamente com empresas e pessoas" },
  { icon: Smartphone, title: "QR Code Pessoal", desc: "Escaneie nos ecopontos e receba pontos automaticamente" },
  { icon: Cpu, title: "Sensores IoT", desc: "Tecnologia de ponta para monitoramento dos ecopontos" },
];

export default function SolutionSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">A Solução</span>
          <h2 className="font-space font-bold text-3xl md:text-4xl mt-3">
            Como o GO-ECO funciona
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma completa que torna o descarte de eletrônicos fácil, 
            divertido e recompensador.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-space font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}