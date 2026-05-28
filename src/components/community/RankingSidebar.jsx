import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trophy, Flame } from "lucide-react";
import { getLevelInfo } from "@/lib/levels";
import { motion } from "framer-motion";

const MEDAL = [
  { bg: "from-yellow-400 to-amber-500", text: "text-white", emoji: "🥇", glow: "shadow-[0_0_12px_rgba(251,191,36,0.5)]" },
  { bg: "from-slate-400 to-gray-500",   text: "text-white", emoji: "🥈", glow: "shadow-[0_0_10px_rgba(148,163,184,0.5)]" },
  { bg: "from-orange-500 to-amber-600", text: "text-white", emoji: "🥉", glow: "shadow-[0_0_12px_rgba(249,115,22,0.5)]" },
];

export default function RankingSidebar() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    base44.entities.User.list("-points", 10).then(setTopUsers);
  }, []);

  return (
    <div className="bg-white border border-border/60 rounded-3xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <Trophy className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h3 className="font-outfit font-bold text-sm">Ranking</h3>
          <p className="text-[10px] text-muted-foreground">Top da comunidade</p>
        </div>
        <Flame className="w-4 h-4 text-orange-500 ml-auto animate-wiggle" />
      </div>

      <div className="space-y-2.5">
        {topUsers.map((u, i) => {
          const level = getLevelInfo(u.points || 0);
          const medal = MEDAL[i];
          const isMedal = i < 3;

          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, type: "spring", bounce: 0.3 }}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all cursor-default ${
                isMedal ? "bg-gradient-to-r from-muted/60 to-transparent" : "hover:bg-muted/40"
              }`}
            >
              {/* Rank badge */}
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                isMedal
                  ? `bg-gradient-to-br ${medal.bg} ${medal.text} ${medal.glow}`
                  : "bg-muted text-muted-foreground"
              }`}>
                {isMedal ? medal.emoji : i + 1}
              </div>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden`}>
                {u.avatar_url
                  ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                  : u.full_name?.[0] || "?"
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{u.full_name || u.display_name || "Usuário"}</p>
                <p className="text-[10px] text-muted-foreground">{level.badge} {level.name}</p>
              </div>

              {/* Points */}
              <div className="text-right flex-shrink-0">
                <p className={`text-xs font-bold font-outfit ${isMedal ? "text-primary" : "text-muted-foreground"}`}>
                  {(u.points || 0).toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground">pts</p>
              </div>
            </motion.div>
          );
        })}

        {topUsers.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Seja o primeiro!</p>
          </div>
        )}
      </div>
    </div>
  );
}
