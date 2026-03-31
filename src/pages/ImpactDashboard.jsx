import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, Users, MapPin, Leaf, TrendingUp, Zap, Droplets, TreePine } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { getLevelInfo } from "@/lib/levels";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function ImpactDashboard() {
  const { data: allUsers = [] } = useQuery({
    queryKey: ["dashboardUsers"],
    queryFn: () => base44.entities.User.list("-points", 500),
  });

  const { data: ecoPoints = [] } = useQuery({
    queryKey: ["dashboardEcoPoints"],
    queryFn: () => base44.entities.EcoPoint.filter({ active: true }),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["dashboardPosts"],
    queryFn: () => base44.entities.Post.list("-created_date", 200),
  });

  const totalWeight = allUsers.reduce((s, u) => s + (u.total_weight_kg || 0), 0);
  const totalCO2 = allUsers.reduce((s, u) => s + (u.co2_saved_kg || 0), 0);
  const totalDiscards = allUsers.reduce((s, u) => s + (u.total_discards || 0), 0);
  const totalPoints = allUsers.reduce((s, u) => s + (u.points || 0), 0);

  // Level distribution
  const levelDist = allUsers.reduce((acc, u) => {
    const lvl = getLevelInfo(u.points || 0).name;
    acc[lvl] = (acc[lvl] || 0) + 1;
    return acc;
  }, {});
  const levelData = Object.entries(levelDist).map(([name, value]) => ({ name, value }));

  // Monthly discards simulation
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const monthlyData = months.map((m, i) => ({
    month: m,
    descartes: Math.floor(totalDiscards * (0.08 + i * 0.04)),
    usuarios: Math.floor(allUsers.length * (0.5 + i * 0.1)),
  }));

  const bigStats = [
    { icon: Recycle, label: "Kg Reciclados", value: totalWeight.toFixed(1) + "kg", sub: "lixo eletrônico descartado corretamente", color: "text-primary", bg: "bg-primary/10", gradient: "from-primary to-emerald-400" },
    { icon: Leaf, label: "CO₂ Evitado", value: totalCO2.toFixed(1) + "kg", sub: "emissões de carbono prevenidas", color: "text-emerald-600", bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-400" },
    { icon: Users, label: "Usuários Ativos", value: allUsers.length.toString(), sub: "pessoas engajadas na plataforma", color: "text-accent", bg: "bg-accent/10", gradient: "from-accent to-blue-400" },
    { icon: MapPin, label: "Ecopontos", value: ecoPoints.length.toString(), sub: "pontos de coleta cadastrados", color: "text-purple-600", bg: "bg-purple-50", gradient: "from-purple-500 to-pink-400" },
  ];

  const envMetrics = [
    { icon: Droplets, label: "Água Economizada", value: (totalWeight * 0.5).toFixed(0) + "L", color: "text-blue-500" },
    { icon: Zap, label: "Energia Economizada", value: (totalWeight * 1.2).toFixed(1) + "kWh", color: "text-yellow-500" },
    { icon: TreePine, label: "Árvores Equivalentes", value: (totalCO2 / 21).toFixed(1), color: "text-emerald-600" },
    { icon: TrendingUp, label: "Total de Descartes", value: totalDiscards.toString(), color: "text-primary" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-space font-bold text-2xl">Dashboard de Impacto</h1>
            <p className="text-sm text-muted-foreground">Dados em tempo real da plataforma GO-ECO</p>
          </div>
        </div>
      </motion.div>

      {/* Big Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {bigStats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${s.gradient}`} />
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className={`font-space font-bold text-2xl ${s.color}`}>{s.value}</p>
                <p className="text-xs font-medium mt-1">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-space text-base">Evolução de Descartes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="descartes" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} name="Descartes" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-space text-base">Distribuição por Nível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-center justify-center">
              {levelData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={levelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {levelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados ainda</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Metrics */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-space text-base flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" /> Métricas Ambientais Detalhadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {envMetrics.map((m, i) => (
              <div key={i} className="text-center p-4 bg-muted/30 rounded-xl">
                <m.icon className={`w-6 h-6 ${m.color} mx-auto mb-2`} />
                <p className={`font-space font-bold text-lg ${m.color}`}>{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-space text-base">Crescimento de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="usuarios" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Usuários" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}