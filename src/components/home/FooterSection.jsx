import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Github, Instagram, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const LINKS = [
  {
    title: "Plataforma",
    items: [
      { label: "Comunidade", to: "/comunidade" },
      { label: "Negociação", to: "/negociacao" },
      { label: "Mapa de Ecopontos", to: "/mapa" },
      { label: "Gamificação", to: "/gamificacao" },
    ],
  },
  {
    title: "Recursos",
    items: [
      { label: "Assistente IA", to: "/assistente" },
      { label: "QR Code", to: "/qrcode" },
      { label: "Meu Perfil", to: "/perfil" },
      { label: "Mensagens", to: "/mensagens" },
    ],
  },
  {
    title: "Impacto",
    items: [
      { label: "Dashboard de Impacto", to: "/impacto" },
      { label: "Notificações", to: "/notificacoes" },
    ],
  },
];

const SOCIAL = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center animate-glow-pulse">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-outfit font-bold text-xl text-white">
                GO<span className="text-emerald-400">-ECO</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Vencer com sustentabilidade. Transformamos o descarte de eletrônicos em impacto ambiental positivo.
            </p>
            <p className="text-slate-500 text-xs mb-5">Uma iniciativa do IFSP Campus Pirituba 🎓</p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-400/10 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {LINKS.map((col, i) => (
            <div key={i}>
              <h4 className="font-outfit font-semibold text-sm text-white mb-5">{col.title}</h4>
              <div className="space-y-3">
                {col.items.map((item, j) => (
                  <Link
                    key={j}
                    to={item.to}
                    className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors group flex items-center gap-1.5"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-emerald-400 transition-all duration-200 inline-block" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2026 GO-ECO. Todos os direitos reservados.</p>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            Feito com
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            </motion.span>
            por estudantes do IFSP
          </div>
        </div>
      </div>
    </footer>
  );
}
