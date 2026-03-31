import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2, Globe, TrendingUp } from "lucide-react";

const stats = [
  { icon: Trash2, value: "62M", unit: "toneladas", desc: "de lixo eletrônico gerado por ano no mundo" },
  { icon: TrendingUp, value: "21%", unit: "crescimento", desc: "nos últimos 5 anos" },
  { icon: Globe, value: "17%", unit: "reciclado", desc: "apenas uma fração é descartada corretamente" },
  { icon: AlertTriangle, value: "50+", unit: "substâncias", desc: "tóxicas presentes em eletrônicos" },
];

export default function ProblemSection() {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">O Problema</span>
          <h2 className="font-space font-bold text-3xl md:text-4xl mt-3">
            O lixo eletrônico é uma <span className="text-primary">crise silenciosa</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Celulares, computadores, baterias — bilhões de dispositivos são descartados 
            incorretamente todos os anos, contaminando solo, água e ar.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="font-space font-bold text-3xl">{stat.value}</p>
              <p className="text-sm text-primary font-medium mt-1">{stat.unit}</p>
              <p className="text-xs text-background/60 mt-2">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}