import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getLevelInfo } from "@/lib/levels";
import RankingSidebar from "./RankingSidebar";

export default function RecentPostsSidebar({ posts }) {
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Recent Posts */}
      <div className="bg-card border rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Posts Recentes</p>
        <div className="space-y-4">
          {recentPosts.map((post) => {
            const level = getLevelInfo(0);
            return (
              <div key={post.id} className="flex gap-3 group">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center text-white text-lg font-bold`}>
                      {post.author_name?.[0] || "?"}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Link
                      to={`/usuario?email=${encodeURIComponent(post.author_email)}`}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors truncate max-w-[80px]"
                    >
                      {post.author_name}
                    </Link>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {post.created_date && formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>❤️ {post.likes_count || 0}</span>
                    <span>💬 {post.comments_count || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {recentPosts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">Nenhum post ainda</p>
          )}
        </div>
      </div>

      {/* Ranking */}
      <RankingSidebar />
    </div>
  );
}