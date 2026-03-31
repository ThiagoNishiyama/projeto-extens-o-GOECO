import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Gift, Star, Zap, TrendingUp } from "lucide-react";
import { getLevelInfo, LEVELS } from "@/lib/levels";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BadgesSection from "@/components/gamification/BadgesSection";
import ImpactMetrics from "@/components/gamification/ImpactMetrics";

export default function Gamification() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => base44.entities.Challenge.filter({ active: true }),
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => base44.entities.RewardItem.filter({ available: true }),
  });

  const { data: topUsers = [] } = useQuery({
    queryKey: ["topUsers"],
    queryFn: () => base44.entities.User.list("-points", 20),
  });

  const levelInfo = getLevelInfo(user?.points || 0);

  const handleRedeemReward = async (reward) => {
    if (!user) return toast.error("Faça login primeiro");
    if ((user.points || 0) < reward.points_cost) return toast.error("Pontos insuficientes");
    await base44.auth.updateMe({ points: (user.points || 0) - reward.points_cost });
    setUser({ ...user, points: (user.points || 0) - reward.points_cost });
    toast.success(`Recompensa "${reward.name}" resgatada!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-space font-bold text-2xl mb-1">Gamificação</h1>
        <p className="text-sm text-muted-foreground">Ganhe pontos, suba de nível e conquiste recompensas</p>
      </div>

      {/* User Level Card */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${levelInfo.color}`} />
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${levelInfo.color} flex items-center justify-center text-white text-3xl shadow-lg`}>
                  {levelInfo.badge}
                </div>
                <div className="flex-1">
                  <h2 className="font-space font-bold text-xl">{user.full_name}</h2>
                  <p className="text-muted-foreground text-sm mt-1">Nível: <strong className="text-foreground">{levelInfo.name}</strong></p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{user.points || 0} pontos</span>
                      {levelInfo.nextLevel && <span className="text-muted-foreground">{levelInfo.nextLevel.min} pts</span>}
                    </div>
                    <Progress value={levelInfo.progress} className="h-2" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-space font-bold text-xl text-primary">{user.total_discards || 0}</p>
                    <p className="text-xs text-muted-foreground">Descartes</p>
                  </div>
                  <div>
                    <p className="font-space font-bold text-xl text-primary">{(user.total_weight_kg || 0).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Kg reciclados</p>
                  </div>
                  <div>
                    <p className="font-space font-bold text-xl text-primary">{(user.co2_saved_kg || 0).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Kg CO₂ evitados</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Global Impact Metrics */}
      <div className="mb-8">
        <h2 className="font-space font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Impacto Global da Comunidade
        </h2>
        <ImpactMetrics />
      </div>

      {/* Badges */}
      <div className="mb-8">
        <BadgesSection user={user} />
      </div>

      {/* Levels Overview */}
      <div className="mb-8">
        <h2 className="font-space font-semibold text-lg mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" /> Níveis
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LEVELS.map((lvl) => (
            <div
              key={lvl.name}
              className={`rounded-xl p-4 text-center border transition-all ${
                levelInfo.name === lvl.name ? "border-primary bg-primary/5 shadow-sm" : "bg-card"
              }`}
            >
              <span className="text-2xl">{lvl.badge}</span>
              <p className="font-medium text-sm mt-2">{lvl.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lvl.min}+ pts</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Challenges */}
        <div>
          <h2 className="font-space font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Desafios Ativos
          </h2>
          <div className="space-y-3">
            {challenges.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground text-sm">Nenhum desafio ativo no momento</p>
              </Card>
            ) : (
              challenges.map((c) => (
                <Card key={c.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        +{c.points_reward} pontos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Rewards Shop */}
        <div>
          <h2 className="font-space font-semibold text-lg mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" /> Loja de Recompensas
          </h2>
          <div className="space-y-3">
            {rewards.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground text-sm">Em breve novas recompensas</p>
              </Card>
            ) : (
              rewards.map((r) => (
                <Card key={r.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl flex-shrink-0"
                      onClick={() => handleRedeemReward(r)}
                    >
                      {r.points_cost} pts
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ranking */}
      <div className="mt-8">
        <h2 className="font-space font-semibold text-lg mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" /> Ranking Global
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {topUsers.map((u, i) => {
                const lvl = getLevelInfo(u.points || 0);
                return (
                  <div key={u.id} className="flex items-center gap-4 px-4 py-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? "bg-yellow-100 text-yellow-700" :
                      i === 1 ? "bg-gray-100 text-gray-600" :
                      i === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${lvl.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {u.full_name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{lvl.badge} {lvl.name}</p>
                    </div>
                    <span className="font-space font-bold text-primary">{u.points || 0}</span>
                  </div>
                );
              })}
              {topUsers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">Nenhum participante ainda</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}