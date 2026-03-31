import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, AlertTriangle, CheckCircle2, XCircle, Recycle, Zap } from "lucide-react";

const canDiscard = [
  "Celulares e smartphones",
  "Computadores e notebooks",
  "Tablets e e-readers",
  "Baterias e pilhas",
  "Cabos e carregadores",
  "Monitores e TVs",
  "Impressoras e scanners",
  "Placas e componentes",
];

const cannotDiscard = [
  "Lâmpadas fluorescentes (ponto específico)",
  "Pilhas de lítio danificadas (risco de explosão)",
  "Equipamentos médicos (descarte especial)",
  "Resíduos radioativos",
];

const risks = [
  { icon: "☠️", title: "Chumbo e Mercúrio", desc: "Contamina solo e lençóis freáticos por décadas" },
  { icon: "🔥", title: "Cádmio", desc: "Cancerígeno, presente em baterias e monitores" },
  { icon: "💀", title: "Arsênio", desc: "Altamente tóxico, encontrado em placas de circuito" },
  { icon: "🌊", title: "Contaminação", desc: "Um único celular pode contaminar até 500L de água" },
];

export default function EducationSection() {
  const [activeTab, setActiveTab] = useState("what");

  const tabs = [
    { id: "what", label: "O que é?", icon: BookOpen },
    { id: "risks", label: "Riscos", icon: AlertTriangle },
    { id: "can", label: "Pode descartar", icon: CheckCircle2 },
    { id: "benefits", label: "Benefícios", icon: Recycle },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Educação Ambiental</span>
          <h2 className="font-space font-bold text-3xl md:text-4xl mt-3">
            Entenda o lixo eletrônico
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Conhecimento é o primeiro passo para a mudança. Saiba como agir de forma responsável.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border hover:border-primary/30 text-muted-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "what" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border rounded-2xl p-8">
                <h3 className="font-space font-bold text-xl mb-4">O que é lixo eletrônico (e-lixo)?</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Lixo eletrônico, ou <strong className="text-foreground">REEE (Resíduos de Equipamentos Elétricos e Eletrônicos)</strong>, 
                  são todos os dispositivos que chegaram ao fim de sua vida útil — desde celulares e computadores 
                  até eletrodomésticos e baterias.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  O Brasil é o <strong className="text-foreground">maior gerador de lixo eletrônico da América Latina</strong>, 
                  produzindo mais de 2,1 milhões de toneladas por ano. Apenas uma pequena fração é descartada corretamente.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                  <p className="text-sm font-medium text-primary flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Você sabia?
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reciclar 1 milhão de celulares recupera cerca de 16 toneladas de cobre, 350 kg de prata, 34 kg de ouro e 15 kg de paládio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "risks" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {risks.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-destructive/20 rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl mb-3">{r.icon}</div>
                  <h4 className="font-space font-semibold text-sm mb-2">{r.title}</h4>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "can" && (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="font-space font-semibold">Pode descartar nos Ecopontos</h3>
                </div>
                <ul className="space-y-2">
                  {canDiscard.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-destructive/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-space font-semibold">Requer descarte especial</h3>
                </div>
                <ul className="space-y-2">
                  {cannotDiscard.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4 border-t pt-3">
                  Esses itens possuem pontos de coleta específicos. Consulte a prefeitura da sua cidade.
                </p>
              </div>
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { emoji: "🌍", title: "Ambiental", items: ["Reduz contaminação do solo", "Preserva lençóis freáticos", "Diminui emissão de CO₂", "Protege a biodiversidade"] },
                { emoji: "♻️", title: "Econômico", items: ["Recupera metais preciosos", "Gera empregos verdes", "Reduz custos de extração", "Incentiva economia circular"] },
                { emoji: "🧠", title: "Social", items: ["Conscientização ambiental", "Educação sustentável", "Saúde pública protegida", "Comunidades mais limpas"] },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border rounded-2xl p-6"
                >
                  <div className="text-3xl mb-3">{b.emoji}</div>
                  <h4 className="font-space font-semibold mb-3">{b.title}</h4>
                  <ul className="space-y-1.5">
                    {b.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}