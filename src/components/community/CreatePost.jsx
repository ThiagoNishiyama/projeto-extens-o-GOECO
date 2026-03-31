import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Send, X, MapPin, Recycle, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { getLevelInfo } from "@/lib/levels";

const WASTE_TYPES = ["Celular", "Computador", "Bateria", "Cabo", "Placa", "Monitor", "Periférico", "Outro"];
const ACHIEVEMENTS = ["🏆 Primeira reciclagem", "🔥 7 dias consecutivos", "💯 100 pontos", "🌍 10kg reciclados", "⭐ Nível subido"];
const QUICK_EMOJIS = ["🌱", "♻️", "📱", "💚", "🌍", "⚡", "🔋", "🗑️"];

export default function CreatePost({ user, onCreated }) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [wasteKg, setWasteKg] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [ecoPointName, setEcoPointName] = useState("");
  const [achievement, setAchievement] = useState("");

  const levelInfo = getLevelInfo(user?.points || 0);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addEmoji = (emoji) => setContent((c) => c + emoji);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    let image_url = "";
    if (imageFile) {
      const res = await base44.integrations.Core.UploadFile({ file: imageFile });
      image_url = res.file_url;
    }
    await base44.entities.Post.create({
      content,
      image_url,
      author_name: user.display_name || user.full_name,
      author_email: user.email,
      author_avatar: user.avatar_url || "",
      author_level: levelInfo.name,
      likes: [],
      likes_count: 0,
      comments_count: 0,
      waste_kg: wasteKg ? parseFloat(wasteKg) : null,
      waste_type: wasteType || null,
      eco_point_name: ecoPointName || null,
      achievement: achievement || null,
    });
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    setWasteKg("");
    setWasteType("");
    setEcoPointName("");
    setAchievement("");
    setShowExtras(false);
    setLoading(false);
    onCreated();
    toast.success("Post publicado! 🌱");
  };

  return (
    <div className="bg-card border rounded-2xl overflow-hidden">
      <div className="flex gap-3 p-4">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${levelInfo.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ${levelInfo.borderColor || "ring-primary/30"}`}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
          ) : (
            user?.display_name?.[0] || user?.full_name?.[0] || "U"
          )}
        </div>

        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Compartilhe sua ação sustentável... 🌱"
            className="border-0 bg-transparent resize-none p-0 text-sm focus-visible:ring-0 min-h-[60px]"
          />

          {/* Quick Emojis */}
          <div className="flex gap-1 mt-1 flex-wrap">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="text-base hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          {imagePreview && (
            <div className="relative mt-2 inline-block">
              <img src={imagePreview} className="max-h-40 rounded-xl" alt="Preview" />
              <button
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}

          {/* Extra fields */}
          {showExtras && (
            <div className="mt-3 space-y-2 border-t pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">♻️ Kg reciclados</label>
                  <input
                    type="number"
                    placeholder="Ex: 2.5"
                    value={wasteKg}
                    onChange={(e) => setWasteKg(e.target.value)}
                    className="w-full text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary/20"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">🗑️ Tipo de resíduo</label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary/20"
                  >
                    <option value="">Selecionar...</option>
                    {WASTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">📍 Ecoponto visitado</label>
                <input
                  type="text"
                  placeholder="Nome do ecoponto..."
                  value={ecoPointName}
                  onChange={(e) => setEcoPointName(e.target.value)}
                  className="w-full text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">🏆 Conquista</label>
                <select
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  className="w-full text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 ring-primary/20"
                >
                  <option value="">Selecionar conquista...</option>
                  {ACHIEVEMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ImagePlus className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              <button
                type="button"
                onClick={() => setShowExtras(!showExtras)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Recycle className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Impacto</span>
                {showExtras ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              size="sm"
              className="rounded-xl gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}