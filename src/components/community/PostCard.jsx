import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLevelInfo } from "@/lib/levels";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const LEVEL_BORDER = {
  "Bronze":    "ring-2 ring-amber-400",
  "Prata":     "ring-2 ring-gray-400",
  "Ouro":      "ring-2 ring-yellow-400",
  "Platina":   "ring-2 ring-cyan-400",
  "Eco Master":"ring-2 ring-emerald-400",
};

const LEVEL_NAME_COLOR = {
  "Bronze":    "text-amber-600",
  "Prata":     "text-gray-500",
  "Ouro":      "text-yellow-500",
  "Platina":   "text-cyan-500",
  "Eco Master":"text-emerald-500",
};

const LEVEL_BADGE_STYLE = {
  "Bronze":    "bg-amber-100 text-amber-700 border border-amber-300",
  "Prata":     "bg-gray-100 text-gray-600 border border-gray-300",
  "Ouro":      "bg-yellow-50 text-yellow-600 border border-yellow-400 font-bold",
  "Platina":   "bg-cyan-50 text-cyan-600 border border-cyan-400 font-bold",
  "Eco Master":"bg-emerald-50 text-emerald-600 border border-emerald-400 font-bold",
};

const LEVEL_ICONS = {
  "Bronze":    "🟤",
  "Prata":     "⚪",
  "Ouro":      "🟡",
  "Platina":   "💎",
  "Eco Master":"🌱",
};

function renderContent(text) {
  // Hashtag and emoji highlight
  return text.split(/(\s+)/).map((word, i) => {
    if (word.startsWith("#")) {
      return (
        <span key={i} className="text-primary font-semibold cursor-pointer hover:underline">
          {word}
        </span>
      );
    }
    return word;
  });
}

export default function PostCard({ post, currentUser, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [saved, setSaved] = useState(false);

  const level = post.author_level || "Bronze";
  const isLiked = post.likes?.includes(currentUser?.email);
  const levelInfo = getLevelInfo(0);

  const handleLike = async () => {
    if (!currentUser) return toast.error("Faça login para curtir");
    const newLikes = isLiked
      ? (post.likes || []).filter((e) => e !== currentUser.email)
      : [...(post.likes || []), currentUser.email];
    await base44.entities.Post.update(post.id, {
      likes: newLikes,
      likes_count: newLikes.length,
    });
    // Notificar autor do post (só ao curtir, não ao descurtir)
    if (!isLiked && currentUser.email !== post.author_email) {
      await base44.entities.Notification.create({
        user_email: post.author_email,
        type: "like",
        title: "Curtida no seu post ❤️",
        message: `${currentUser.full_name} curtiu sua publicação.`,
        from_user: currentUser.email,
        read: false,
      });
    }
    onUpdate();
  };

  const loadComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      const data = await base44.entities.Comment.filter({ post_id: post.id }, "-created_date", 20);
      setComments(data);
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;
    await base44.entities.Comment.create({
      post_id: post.id,
      content: comment,
      author_name: currentUser.full_name,
      author_email: currentUser.email,
    });
    await base44.entities.Post.update(post.id, {
      comments_count: (post.comments_count || 0) + 1,
    });
    // Notificar autor do post
    if (currentUser.email !== post.author_email) {
      await base44.entities.Notification.create({
        user_email: post.author_email,
        type: "comment",
        title: "Novo comentário 💬",
        message: `${currentUser.full_name}: "${comment.slice(0, 60)}${comment.length > 60 ? "..." : ""}"`,
        from_user: currentUser.email,
        read: false,
      });
    }
    setComment("");
    const data = await base44.entities.Comment.filter({ post_id: post.id }, "-created_date", 20);
    setComments(data);
    onUpdate();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/comunidade?post=" + post.id);
    toast.success("Link copiado!");
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? "Post removido dos salvos" : "Post salvo!");
  };

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Author */}
      <div className="flex items-center gap-3 p-4">
        <Link to={`/usuario?email=${encodeURIComponent(post.author_email)}`}>
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${levelInfo.color} flex items-center justify-center text-white font-bold text-sm ${LEVEL_BORDER[level] || ""} hover:opacity-80 transition-opacity`}>
            {post.author_avatar ? (
              <img src={post.author_avatar} className="w-full h-full rounded-full object-cover" alt="" />
            ) : (
              post.author_name?.[0] || "?"
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/usuario?email=${encodeURIComponent(post.author_email)}`}
              className={`font-semibold text-sm truncate hover:underline transition-colors ${LEVEL_NAME_COLOR[level] || "text-foreground"}`}
            >
              {post.author_name}
            </Link>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${LEVEL_BADGE_STYLE[level] || ""}`}>
              {LEVEL_ICONS[level]} {level}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {post.created_date && formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{renderContent(post.content)}</p>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full max-h-96 object-cover" />
      )}

      {/* Environmental Impact */}
      {(post.waste_kg || post.eco_point_name || post.waste_type || post.achievement) && (
        <div className="mx-4 mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap gap-3 text-xs text-emerald-700">
          {post.waste_kg && (
            <span className="flex items-center gap-1 font-medium">
              ♻️ <strong>+{post.waste_kg}kg</strong> reciclados
            </span>
          )}
          {post.waste_kg && (
            <span className="flex items-center gap-1 font-medium">
              🌍 CO₂ evitado: <strong>{(post.waste_kg * 0.65).toFixed(1)}kg</strong>
            </span>
          )}
          {post.waste_type && (
            <span className="flex items-center gap-1">🗑️ {post.waste_type}</span>
          )}
          {post.eco_point_name && (
            <span className="flex items-center gap-1">📍 {post.eco_point_name}</span>
          )}
          {post.achievement && (
            <span className="flex items-center gap-1">🏆 {post.achievement}</span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground border-t">
        <span>{post.likes_count || 0} curtidas</span>
        <span>{post.comments_count || 0} comentários</span>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex border-t">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">Curtir</span>
        </button>
        <button
          onClick={loadComments}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Comentar</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Compartilhar</span>
        </button>
        <button
          onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            saved ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">Salvar</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t px-4 py-3 space-y-3">
          {loadingComments ? (
            <p className="text-sm text-muted-foreground text-center py-2">Carregando...</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <Link to={`/usuario?email=${encodeURIComponent(c.author_email)}`} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0 hover:opacity-80 transition-opacity">
                  {c.author_name?.[0]}
                </Link>
                <div className="bg-muted rounded-xl px-3 py-2 flex-1">
                  <Link to={`/usuario?email=${encodeURIComponent(c.author_email)}`} className="text-xs font-medium hover:text-primary transition-colors">{c.author_name}</Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.content}</p>
                </div>
              </div>
            ))
          )}
          {currentUser && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 text-sm bg-muted rounded-xl px-3 py-2 outline-none focus:ring-2 ring-primary/20"
              />
              <Button type="submit" size="sm" className="rounded-xl" disabled={!comment.trim()}>
                Enviar
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}