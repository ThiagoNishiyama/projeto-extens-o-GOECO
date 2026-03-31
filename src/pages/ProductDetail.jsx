import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, MapPin, Package, User, MessageCircle,
  Star, ShoppingBag, TrendingUp, Heart, Share2,
  BadgeCheck, Building2, ChevronLeft, ChevronRight,
  Leaf, Zap, Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS_STYLE = {
  "Disponível": "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Negociando": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Vendido":    "bg-gray-100 text-gray-500 border-gray-300",
};

const CO2_PER_KG = { Baterias: 2.1, Celulares: 1.8, Computadores: 1.5, Placas: 1.9, Cabos: 0.8, Monitores: 1.2, Periféricos: 0.9, Outros: 1.0 };

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [proposal, setProposal] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const productId = window.location.pathname.split("/").pop();

  useEffect(() => {
    const load = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (authed) setUser(await base44.auth.me());
      const products = await base44.entities.Product.filter({ id: productId });
      if (products.length > 0) {
        const p = products[0];
        setProduct(p);
        setProposal(`Olá! Tenho interesse no seu anúncio "${p.title}". Podemos negociar?`);
        const allSeller = await base44.entities.Product.filter({ seller_email: p.seller_email });
        setSellerProducts(allSeller);
      }
      setLoading(false);
    };
    load();
  }, [productId]);

  const soldCount = sellerProducts.filter((p) => p.status === "Vendido").length;
  const totalListings = sellerProducts.length;
  const reputation = soldCount >= 10 ? { label: "Excelente", stars: 5, color: "text-emerald-600", bg: "bg-emerald-50" }
    : soldCount >= 5 ? { label: "Ótimo", stars: 4, color: "text-primary", bg: "bg-primary/10" }
    : soldCount >= 2 ? { label: "Bom", stars: 3, color: "text-yellow-600", bg: "bg-yellow-50" }
    : { label: "Novo", stars: 2, color: "text-muted-foreground", bg: "bg-muted" };

  // Build images array (main + extras if any)
  const images = product?.image_url ? [product.image_url] : [];

  const co2Factor = product ? (CO2_PER_KG[product.material_type] || 1.0) : 1.0;
  const co2Saved = product ? ((product.quantity || 1) * co2Factor).toFixed(1) : 0;
  const treesEq = product ? (((product.quantity || 1) * co2Factor) / 21).toFixed(2) : 0;

  const handleNegotiate = async () => {
    if (!user) return toast.error("Faça login para negociar");
    setSending(true);
    const conv = await base44.entities.Conversation.create({
      participants: [user.email, product.seller_email],
      participant_names: [user.full_name, product.seller_name],
      last_message: proposal,
      last_message_date: new Date().toISOString(),
    });
    await base44.entities.Message.create({
      conversation_id: conv.id,
      sender_email: user.email,
      sender_name: user.full_name,
      content: proposal + (quantity > 1 ? `\n\nQuantidade desejada: ${quantity} ${product.unit || "kg"}` : ""),
    });
    setSending(false);
    setShowNegotiateModal(false);
    toast.success("Proposta enviada! 🤝");
    navigate("/mensagens");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado!");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <p className="text-muted-foreground">Produto não encontrado</p>
      <Button variant="outline" asChild className="mt-4"><Link to="/negociacao">Voltar</Link></Button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Button variant="ghost" asChild className="mb-6 -ml-2 gap-2">
        <Link to="/negociacao"><ArrowLeft className="w-4 h-4" /> Voltar à negociação</Link>
      </Button>

      <div className="grid md:grid-cols-[1fr_420px] gap-8">

        {/* LEFT: Gallery */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <Package className="w-20 h-20 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">{product.material_type}</p>
              </div>
            )}
            {/* Status badge */}
            <div className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLE[product.status] || STATUS_STYLE["Disponível"]}`}>
              {product.status === "Disponível" ? "✅" : product.status === "Negociando" ? "🟡" : "🔴"} {product.status || "Disponível"}
            </div>
            {/* Arrows if multiple */}
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-primary" : "border-transparent"}`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}

          {/* Environmental Impact Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">🌍 Impacto Ambiental Estimado</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg">♻️</span>
                </div>
                <p className="font-space font-bold text-sm text-emerald-700">{product.quantity} {product.unit}</p>
                <p className="text-[10px] text-emerald-600">reciclados</p>
              </div>
              <div className="text-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-1">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-space font-bold text-sm text-emerald-700">{co2Saved}kg</p>
                <p className="text-[10px] text-emerald-600">CO₂ evitado</p>
              </div>
              <div className="text-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-1">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-space font-bold text-sm text-emerald-700">{treesEq}</p>
                <p className="text-[10px] text-emerald-600">árvores equiv.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="space-y-5">
          {/* Title & price */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                📦 {product.material_type}
              </span>
              {product.seller_type === "Empresa" && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
                  <Building2 className="w-3 h-3" /> Empresa
                </span>
              )}
              {product.verified && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3 h-3" /> Verificado
                </span>
              )}
            </div>
            <h1 className="font-space font-bold text-2xl mb-3">{product.title}</h1>
            <p className="font-space font-bold text-4xl text-primary">R$ {(product.price || 0).toFixed(2)}</p>
          </div>

          {product.description && (
            <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/30 pl-3">{product.description}</p>
          )}

          {/* Details */}
          <div className="bg-muted/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span><strong>{product.quantity} {product.unit || "kg"}</strong> disponíveis</span>
            </div>
            {product.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{product.location}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span>Publicado {product.created_date && formatDistanceToNow(new Date(product.created_date), { addSuffix: true, locale: ptBR })}</span>
            </div>
          </div>

          {/* Seller Card */}
          <div className="border rounded-2xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Vendedor</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {product.seller_name?.[0] || "V"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{product.seller_name}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= reputation.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{reputation.label}</span>
                </div>
              </div>
              <Link to={`/usuario?email=${product.seller_email}`} className="text-xs text-primary hover:underline">
                Ver perfil →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/40 rounded-xl p-2.5 text-center">
                <p className="font-space font-bold text-base">{totalListings}</p>
                <p className="text-[10px] text-muted-foreground">Anúncios</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-2.5 text-center">
                <p className="font-space font-bold text-base text-emerald-600">{soldCount}</p>
                <p className="text-[10px] text-muted-foreground">Vendas</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-2.5 text-center">
                <p className="font-space font-bold text-base text-yellow-500">{reputation.stars}.0</p>
                <p className="text-[10px] text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {user?.email !== product.seller_email && (
            <div className="space-y-2">
              <Button
                className="w-full rounded-xl h-12 text-base gap-2"
                onClick={() => setShowNegotiateModal(true)}
                disabled={product.status === "Vendido"}
              >
                <MessageCircle className="w-5 h-5" />
                {product.status === "Vendido" ? "Produto vendido" : "💬 Enviar Proposta"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className={`rounded-xl gap-2 ${favorited ? "text-red-500 border-red-300" : ""}`}
                  onClick={() => { setFavorited(!favorited); toast.success(favorited ? "Removido dos favoritos" : "❤️ Favoritado!"); }}
                >
                  <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
                  {favorited ? "Favoritado" : "Favoritar"}
                </Button>
                <Button variant="outline" className="rounded-xl gap-2" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Negotiate Modal */}
      <Dialog open={showNegotiateModal} onOpenChange={setShowNegotiateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-space">💬 Enviar Proposta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
              {product.image_url ? (
                <img src={product.image_url} className="w-14 h-14 rounded-lg object-cover" alt="" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-2xl">📦</div>
              )}
              <div>
                <p className="font-medium text-sm line-clamp-1">{product.title}</p>
                <p className="font-space font-bold text-primary">R$ {(product.price || 0).toFixed(2)}</p>
              </div>
            </div>

            <div>
              <Label>Quantidade desejada ({product.unit})</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                max={product.quantity}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Máx: {product.quantity} {product.unit}</p>
            </div>

            <div>
              <Label>Sua mensagem</Label>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full mt-1 text-sm bg-muted rounded-xl px-3 py-2.5 outline-none focus:ring-2 ring-primary/20 resize-none"
                rows={4}
              />
            </div>

            {quantity > 0 && (
              <div className="text-sm text-muted-foreground bg-muted/40 rounded-xl p-3">
                Valor estimado: <strong className="text-foreground">R$ {((product.price / (product.quantity || 1)) * quantity).toFixed(2)}</strong>
              </div>
            )}

            <Button onClick={handleNegotiate} disabled={sending || !proposal.trim()} className="w-full rounded-xl h-11 gap-2">
              <MessageCircle className="w-4 h-4" />
              {sending ? "Enviando..." : "Enviar Proposta"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}