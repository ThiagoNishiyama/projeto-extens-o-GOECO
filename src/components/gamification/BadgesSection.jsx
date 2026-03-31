import React from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const BADGES = [
  { emoji: "🌱", name: "Eco Iniciante", desc: "Realize 5 descartes", threshold: 5, field: "total_discards" },
  { emoji: "♻️", name: "Reciclador", desc: "Realize 20 descartes", threshold: 20, field: "total_discards" },
  { emoji: "🛡️", name: "Guardião Verde", desc: "Realize 50 descartes", threshold: 50, field: "total_discards" },
  { emoji: "🌟", name: "Eco Herói", desc: "Realize 100 descartes", threshold: 100, field: "total_discards" },
  { emoji: "🏆", name: "Lenda Sustentável", desc: "Realize 200 descartes", threshold: 200, field: "total_discards" },
  { emoji: "⚡", name: "Primeiro Passo", desc: "Ganhe 100 pontos", threshold: 100, field: "points" },
  { emoji: "💚", name: "Comprometido", desc: "Ganhe 500 pontos", threshold: 500, field: "points" },
  { emoji: "🌍", name: "Transformador", desc: "Ganhe 1000 pontos", threshold: 1000, field: "points" },
];

export default function BadgesSection({ user }) {
  const discards = user?.total_discards || 0;
  const points = user?.points || 0;

  const isUnlocked = (badge) => {
    const val = badge.field === "total_discards" ? discards : points;
    return val >= badge.threshold;
  };

  const unlockedCount = BADGES.filter(isUnlocked).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-space font-semibold text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Conquistas
        </h2>
        <span className="text-sm text-muted-foreground">{unlockedCount}/{BADGES.length} desbloqueadas</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BADGES.map((badge, i) => {
          const unlocked = isUnlocked(badge);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-4 text-center border transition-all ${
                unlocked
                  ? "bg-card border-primary/30 shadow-sm"
                  : "bg-muted/30 border-border opacity-50 grayscale"
              }`}
            >
              <div className="text-3xl mb-2">{badge.emoji}</div>
              <p className="font-medium text-xs">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
              {unlocked && (
                <span className="inline-block mt-2 text-xs text-primary font-medium">✓ Conquistada</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}