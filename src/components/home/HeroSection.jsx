import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Recycle, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-primary/5 py-20 md:py-32">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <Recycle className="w-8 h-8 text-primary/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-40 right-20 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center"
        >
          <Leaf className="w-6 h-6 text-accent/40" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-1/4 w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center"
        >
          <Zap className="w-5 h-5 text-yellow-400/40" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Plataforma de Sustentabilidade Digital
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-space font-bold text-4xl sm:text-5xl md:text-7xl tracking-tight mb-6"
          >
            GO-<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ECO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground font-light mb-4"
          >
            Vencer com sustentabilidade
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base text-muted-foreground max-w-xl mx-auto mb-10"
          >
            O GO-ECO promove uma nova cultura de descarte consciente, conectando tecnologia, 
            educação ambiental e incentivo social para tornar a sustentabilidade parte do cotidiano.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild className="rounded-xl text-base px-8 h-12">
              <Link to="/comunidade">
                Começar Agora <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-xl text-base px-8 h-12">
              <Link to="/mapa">Ver Ecopontos</Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "500+", label: "Usuários Ativos" },
            { value: "2.5t", label: "Lixo Reciclado" },
            { value: "50+", label: "Ecopontos" },
            { value: "1.2t", label: "CO₂ Evitado" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-space font-bold text-2xl md:text-3xl text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}