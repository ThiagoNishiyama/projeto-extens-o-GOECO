import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Recycle, Leaf, TrendingUp, Weight, TreePine } from "lucide-react";
import { getLevelInfo } from "@/lib/levels";
import { motion } from "framer-motion";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
    });
  }, []);

  const { data: posts = [] } = useQuery({
    queryKey: ["myPosts", user?.email],
    queryFn: () => base44.entities.Post.filter({ author_email: user.email }, "-created_date", 20),
    enabled: !!user,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["myProducts", user?.email],
    queryFn: () => base44.entities.Product.filter({ seller_email: user.email }, "-created_date", 20),
    enabled: !!user,
  });

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-muted-foreground">Faça login para ver seu perfil</p>
        <Button className="mt-4" onClick={() => base44.auth.redirectToLogin()}>Entrar</Button>
      </div>
    </div>
  );

  // Simulated chart data
  const chartData = [
    { month: "Jan", pontos: 50 },
    { month: "Fev", pontos: 120 },
    { month: "Mar", pontos: 200 },
    { month: "Abr", pontos: 350 },
    { month: "Mai", pontos: 500 },
    { month: "Jun", pontos: user.points || 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ProfileHeader user={user} onUserUpdate={setUser} isOwner={true} />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Recycle, label: "Descartes", value: user.total_discards || 0, color: "text-primary" },
          { icon: Weight, label: "Kg Reciclados", value: (user.total_weight_kg || 0).toFixed(1), color: "text-blue-500" },
          { icon: TreePine, label: "CO₂ Evitados (kg)", value: (user.co2_saved_kg || 0).toFixed(1), color: "text-emerald-500" },
          { icon: TrendingUp, label: "Posts", value: posts.length, color: "text-purple-500" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
              <p className="font-space font-bold text-xl">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calculadora de Impacto */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-space text-lg flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" /> Seu Impacto Ambiental
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="bg-primary/5 rounded-xl p-4">
              <p className="text-3xl font-space font-bold text-primary">
                {((user.total_weight_kg || 0) * 0.5).toFixed(0)}L
              </p>
              <p className="text-xs text-muted-foreground mt-1">Água economizada</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-3xl font-space font-bold text-blue-600">
                {((user.total_weight_kg || 0) * 1.2).toFixed(1)}kWh
              </p>
              <p className="text-xs text-muted-foreground mt-1">Energia economizada</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-3xl font-space font-bold text-emerald-600">
                {((user.co2_saved_kg || 0) / 21).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Árvores equivalentes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evolution Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-space text-lg">Evolução de Pontos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="pontos" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="products">Anúncios ({products.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4 space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum post ainda</p>
          ) : posts.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <p className="text-sm">{p.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{p.likes_count || 0} curtidas • {p.comments_count || 0} comentários</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="products" className="mt-4 space-y-3">
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum anúncio ainda</p>
          ) : products.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.material_type} • R$ {(p.price || 0).toFixed(2)}</p>
                </div>
                <Badge>{p.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}