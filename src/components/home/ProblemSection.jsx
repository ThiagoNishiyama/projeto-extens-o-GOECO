import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AlertTriangle, Trash2, Globe, TrendingUp } from "lucide-react";

function Counter({ from, to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(from);
  const spring = useSpring(mv, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v) + suffix);

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const stats = [
  { icon: Trash2,       value: 62,  suffix: "M",  unit: "toneladas", desc: "de lixo eletrônico por ano no mundo", color: "from-red-500 to-rose-600", glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]" },
  { icon: TrendingUp,   value: 21,  suffix: "%",  unit: "crescimento", desc: "nos últimos 5 anos", color: "from-orange-500 to-amber-500", glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]" },
  { icon: Globe,        value: 17,  suffix: "%",  unit: "reciclado", desc: "apenas uma fração é descartada corretamente", color: "from-yellow-500 to-lime-500", glow: "shadow-[0_0_30px_rgba(132,204,22,0.3)]" },
  { icon: AlertTriangle,value: 50,  suffix: "+",  unit: "substâncias", desc: "tóxicas presentes em eletrônicos", color: "from-purple-500 to-pink-500", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]" },
];

export default function ProblemSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Cinematic dark background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-300 text-sm font-semibold mb-5">
            <AlertTriangle className="w-3.5 h-3.5" /> O Problema
          </div>
          <h2 className="font-outfit font-bold text-3xl md:text-5xl text-white mb-4">
            O lixo eletrônico é uma{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              crise silenciosa
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Celulares, computadores, baterias — bilhões de dispositivos são descartados
            incorretamente todos os anos, contaminando solo, água e ar.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 text-center group overflow-hidden cursor-default ${s.glow} hover:border-white/20 transition-all duration-300`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="w-7 h-7 text-white" />
              </div>

              {/* Counter */}
              <p className={`font-outfit font-black text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-br ${s.color} mb-1`}>
                <Counter from={0} to={s.value} suffix={s.suffix} />
              </p>
              <p className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${s.color} mb-2`}>
                {s.unit}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA to learn more */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-500 text-sm">
            🌍 Juntos podemos mudar esse cenário — uma ação sustentável de cada vez.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
