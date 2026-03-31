import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getLevelInfo } from "@/lib/levels";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PostCard from "@/components/community/PostCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useState, useEffect } from "react";

export default function PublicProfile() {
  const email = new URLSearchParams(window.location.search).get("email");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setCurrentUser(await base44.auth.me());
    });
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ["publicUser", email],
    queryFn: () => base44.entities.User.filter({ email }),
    enabled: !!email,
  });

  const profileUser = users[0];

  const { data: posts = [], refetch: refetchPosts } = useQuery({
    queryKey: ["userPosts", email],
    queryFn: () => base44.entities.Post.filter({ author_email: email }, "-created_date", 50),
    enabled: !!email,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["userProducts", email],
    queryFn: () => base44.entities.Product.filter({ seller_email: email }, "-created_date", 20),
    enabled: !!email,
  });

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/comunidade" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar à comunidade
      </Link>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ProfileHeader user={profileUser} onUserUpdate={() => {}} isOwner={false} currentUser={currentUser} />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="font-space font-bold text-xl">{posts.length}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="font-space font-bold text-xl">{posts.reduce((s, p) => s + (p.likes_count || 0), 0)}</p>
            <p className="text-xs text-muted-foreground">Curtidas recebidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="font-space font-bold text-xl">{products.length}</p>
            <p className="text-xs text-muted-foreground">Anúncios</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="products">Anúncios ({products.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4 space-y-4">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum post ainda</p>
          ) : posts.map((p) => (
            <PostCard key={p.id} post={p} currentUser={currentUser} onUpdate={refetchPosts} />
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