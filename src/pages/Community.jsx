import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreatePost from "@/components/community/CreatePost";
import PostCard from "@/components/community/PostCard";
import LeftSidebar from "@/components/community/LeftSidebar";
import RecentPostsSidebar from "@/components/community/RecentPostsSidebar";
import { Search } from "lucide-react";

export default function Community() {
  const [user, setUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState("recentes");
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => base44.entities.Post.list("-created_date", 50),
  });

  const { data: follows = [] } = useQuery({
    queryKey: ["follows", user?.email],
    queryFn: () => base44.entities.Follow.filter({ follower_email: user?.email }),
    enabled: !!user?.email,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["posts"] });

  const followingEmails = follows.map((f) => f.following_email);

  const filteredPosts = posts
    .filter((post) => {
      if (activeFilter === "seguindo" && !followingEmails.includes(post.author_email)) return false;
      if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !post.author_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (activeFilter === "populares") return (b.likes_count || 0) - (a.likes_count || 0);
      return new Date(b.created_date) - new Date(a.created_date);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid lg:grid-cols-[220px_1fr_280px] gap-6">

        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Main Feed */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar posts ou usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 ring-primary/20 transition-all"
            />
          </div>

          {/* Mobile filters */}
          <div className="flex gap-2 lg:hidden overflow-x-auto pb-1">
            {["recentes", "populares", "seguindo"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                  activeFilter === f ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {user && <CreatePost user={user} onCreated={refresh} />}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="space-y-2">
                      <div className="w-24 h-3 bg-muted rounded" />
                      <div className="w-16 h-2 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-muted rounded" />
                    <div className="w-3/4 h-3 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-card border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum resultado encontrado." : activeFilter === "seguindo" ? "Siga usuários para ver os posts deles aqui." : "Nenhuma publicação ainda. Seja o primeiro!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={user} onUpdate={refresh} />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <RecentPostsSidebar posts={posts} />
        </div>
      </div>
    </div>
  );
}