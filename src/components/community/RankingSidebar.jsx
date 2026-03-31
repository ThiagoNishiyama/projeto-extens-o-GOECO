import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trophy } from "lucide-react";
import { getLevelInfo } from "@/lib/levels";

export default function RankingSidebar() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    base44.entities.User.list("-points", 10).then(setTopUsers);
  }, []);

  return (
    <div className="bg-card border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-space font-semibold">Ranking</h3>
      </div>
      <div className="space-y-3">
        {topUsers.map((u, i) => {
          const level = getLevelInfo(u.points || 0);
          return (
            <div key={u.id} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 ? "bg-yellow-100 text-yellow-700" :
                i === 1 ? "bg-gray-100 text-gray-600" :
                i === 2 ? "bg-orange-100 text-orange-700" :
                "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </span>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white text-xs font-bold`}>
                {u.full_name?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.full_name}</p>
                <p className="text-xs text-muted-foreground">{level.badge} {level.name}</p>
              </div>
              <span className="text-xs font-semibold text-primary">{u.points || 0}</span>
            </div>
          );
        })}
        {topUsers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum usuário ainda</p>
        )}
      </div>
    </div>
  );
}