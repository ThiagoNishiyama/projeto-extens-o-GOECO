import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Rocket } from "lucide-react";

const mvpFeatures = [
  { done: true, label: "Cadastro e login" },
  { done: true, label: "Mapa com ecopontos" },
  { done: true, label: "QR Code pessoal" },
  { done: true, label: "Sistema de pontos e gamificação" },
  { done: true, label: "Perfil do usuário com histórico" },
  { done: true, label: "Comunidade com posts e interações" },
  { done: true, label: "Ranking e níveis" },
  { done: true, label: "Loja de recompensas" },
];

const futureFeatures = [
  "Chat privado entre usuários",
  "Grupos temáticos de sustentabilidade",
  "Marketplace de negociação avançado",
  "Parceria com empresas e ecopontos",
  "Sensores IoT nas lixeiras",
  "Rotas inteligentes e ocupação em tempo real",
  "Dashboard para empresas e relatórios",
  "Desafios coletivos por cidade/bairro",
];

export default function RoadmapSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Roadmap</span>
          <h2 className="font-space font-bold text-3xl md:text-4xl mt-3">
            Do MVP ao futuro
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Desenvolvido de forma estratégica, com um núcleo sólido e uma visão de expansão clara.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* MVP */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border-2 border-primary/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-space font-bold text-lg">MVP — Versão Atual</h3>
                <p className="text-xs text-primary font-medium">✅ Implementado</p>
              </div>
            </div>
            <ul className="space-y-3">
              {mvpFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Future */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-space font-bold text-lg">Futuro do Projeto</h3>
                <p className="text-xs text-accent font-medium">🚀 Próximas versões</p>
              </div>
            </div>
            <ul className="space-y-3">
              {futureFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}