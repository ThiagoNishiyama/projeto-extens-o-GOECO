import React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function TeamSection() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Quem Somos</span>
          <h2 className="font-space font-bold text-3xl md:text-4xl mt-3">
            Estudantes transformando o futuro
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            O GO-ECO é uma iniciativa criada por estudantes do <strong className="text-foreground">IFSP Campus Pirituba</strong>, 
            com a missão de transformar a forma como a sociedade lida com o descarte de eletrônicos. 
            Acreditamos que a tecnologia e a educação podem ser as maiores aliadas do meio ambiente.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Nossa visão é criar uma rede colaborativa onde cada descarte consciente 
            gera impacto positivo — para o planeta e para quem participa.
          </p>
        </motion.div>
      </div>
    </section>
  );
}