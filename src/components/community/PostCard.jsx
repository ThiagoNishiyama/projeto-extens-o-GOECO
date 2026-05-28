import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Heart, MessageCircle, Share2, Bookmark, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLevelInfo } from "@/lib/levels";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const LEVEL_RING = {
  "Bronze":    "ring-2 ring-amber-400/70",
  "Prata":     "ring-2 ring-gray-400/70",
  "Ouro":      "ring-2 ring-yellow-400/70",
  "Platina":   "ring-2 ring-cyan-400/70",
  "Eco Master":"ring-2 ring-emerald-400/70 shadow-glow-green",
};

const LEVEL_BADGE = {
  "Bronze":    "bg-amber-50 text-amber-700 border-amber-200",
  "Prata":     "bg-gray-50 text-gray-600 border-gray-200",
  "Ouro":      "bg-yellow-50 text-yellow-600 border-yellow-200",
  "Platina":   "bg-cyan-50 text-cyan-600 border-cyan-200",
  "Eco Master":"bg-emerald-50 text-emerald-700 border-emerald-200",
};

function renderContent(text) {
  return text.split(/(\s+)/).map((word, i) => {
    if (word.startsWith("#")) {
      return (
        <span key={i} className="text-primary font-semibold cursor-pointer hover:text-primary/80 transition-colors">
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
  const [likeAnim, setLikeAnim] = useState(false);

  const level = post.author_level || "Bronze";
  const isLiked = post.likes?.includes(currentUser?.email);
  const levelInfo = getLevelInfo(0);

  const handleLike = async () => {
    if (!currentUser) return toast.error("Faça login para curtir");
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    const newLikes = isLiked
      ? (post.likes || []).filter((e) => e !== currentUser.email)
      : [...(post.likes || []), currentUser.email];
    await base44.entities.Post.update(post.id, { likes: newLikes, likes_count: newLikes.length });
    if (!isLiked && currentUser.email !== post.author_email) {
      await base44.entities.Notification.create({
        user_email: post.author_email, type: "like",
        title: "Curtida no seu post ❤️",
        message: `${currentUser.full_name} curtiu sua publicação.`,
        from_user: currentUser.email, read: false,
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
      post_id: post.id, content: comment,
      author_name: currentUser.full_name, author_email: currentUser.email,
    });
    await base44.entities.Post.update(post.id, { comments_count: (post.comments_count || 0) + 1 });
    if (currentUser.email !== post.author_email) {
      await base44.entities.Notification.create({
        user_email: post.author_email, type: "comment",
        title: "Novo comentário 💬",
        message: `${currentUser.full_name}: "${comment.slice(0, 60)}${comment.length > 60 ? "..." : ""}"`,
        from_user: currentUser.email, read: false,
      });
    }
    setComment("");
    const data = await base44.entities.Comment.filter({ post_id: post.id }, "-created_date", 20);
    setComments(data);
    onUpdate();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/comunidade?post=" + post.id);
    toast.success("Link copiado! 🔗");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", bounce: 0.2 }}
      className="bg-white border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-card-lift transition-all duration-300 group"
    >
      {/* Author header */}
      <div className="flex items-center gap-3 p-5 pb-4">
        <Link to={`/usuario?email=${encodeURIComponent(post.author_email)}`}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${levelInfo.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${LEVEL_RING[level] || ""} transition-all overflow-hidden`}
          >
            {post.author_avatar
              ? <img src={post.author_avatar} className="w-full h-full object-cover" alt="" />
              : post.author_name?.[0] || "?"
            }
          </motion.div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/usuario?email=${encodeURIComponent(post.author_email)}`}
              className="font-outfit font-semibold text-sm hover:text-primary transition-colors"
            >
              {post.author_name}
            </Link>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${LEVEL_BADGE[level] || ""}`}>
              {post.author_level || "Bronze"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {post.created_date && formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
          {renderContent(post.content)}
        </p>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="overflow-hidden mx-4 rounded-2xl mb-4">
          <img
            src={post.image_url} alt=""
            className="w-full max-h-80 object-cover group-hover:scale-102 transition-transform duration-500"
          />
        </div>
      )}

      {/* Eco Impact tag */}
      {(post.waste_kg || post.eco_point_name || post.waste_type || post.achievement) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-5 mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-emerald-700"
        >
          {post.waste_kg && <span className="flex items-center gap-1 font-semibold">♻️ +{post.waste_kg}kg reciclados</span>}
          {post.waste_kg && <span className="flex items-center gap-1">🌍 {(post.waste_kg * 0.65).toFixed(1)}kg CO₂ evitado</span>}
          {post.waste_type && <span className="flex items-center gap-1">🗑️ {post.waste_type}</span>}
          {post.eco_point_name && <span className="flex items-center gap-1">📍 {post.eco_point_name}</span>}
          {post.achievement && <span className="flex items-center gap-1 font-semibold">🏆 {post.achievement}</span>}
        </motion.div>
      )}

      {/* Stats bar */}
      <div className="px-5 py-2.5 flex items-center gap-4 text-xs text-muted-foreground border-t border-border/40">
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {post.likes_count || 0} curtidas
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3 text-blue-400" /> {post.comments_count || 0} comentários
        </span>
      </div>

      {/* Action buttons */}
      <div className="px-2 py-1.5 flex border-t border-border/40">
        {[
          {
            onClick: handleLike,
            icon: <Heart className={`w-4 h-4 transition-all ${isLiked ? "fill-red-500 text-red-500 scale-110" : ""} ${likeAnim ? "animate-heartbeat" : ""}`} />,
            label: "Curtir",
            active: isLiked,
            activeClass: "text-red-500",
          },
          {
            onClick: loadComments,
            icon: <MessageCircle className={`w-4 h-4 ${showComments ? "text-blue-500" : ""}`} />,
            label: "Comentar",
            active: showComments,
            activeClass: "text-blue-500",
          },
          {
            onClick: handleShare,
            icon: <Share2 className="w-4 h-4" />,
            label: "Compartilhar",
          },
          {
            onClick: () => { setSaved(!saved); toast.success(saved ? "Removido dos salvos" : "Post salvo! 🔖"); },
            icon: <Bookmark className={`w-4 h-4 ${saved ? "fill-primary text-primary" : ""}`} />,
            label: "Salvar",
            active: saved,
            activeClass: "text-primary",
          },
        ].map((btn, i) => (
          <motion.button
            key={i}
            onClick={btn.onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              btn.active ? btn.activeClass : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {btn.icon}
            <span className="hidden sm:inline">{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 px-5 py-4 space-y-3 bg-muted/20">
              {loadingComments ? (
                <p className="text-sm text-muted-foreground text-center py-2">Carregando...</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold flex-shrink-0 text-primary">
                      {c.author_name?.[0]}
                    </div>
                    <div className="bg-white border border-border/40 rounded-2xl px-3.5 py-2 flex-1 shadow-sm">
                      <p className="text-xs font-semibold text-foreground">{c.author_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.content}</p>
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
                    className="flex-1 text-sm bg-white border border-border/50 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 ring-primary/20 focus:border-primary/40 transition-all"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!comment.trim()}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white disabled:opacity-50 flex-shrink-0 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
