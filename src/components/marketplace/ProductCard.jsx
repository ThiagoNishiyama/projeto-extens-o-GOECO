import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Package, Star, BadgeCheck, Building2, Flame } from "lucide-react";

const statusColors = {
  "Disponível": "bg-primary/10 text-primary border-primary/20",
  "Negociando": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Vendido":    "bg-muted text-muted-foreground border-border",
};

const MATERIAL_ICONS = {
  "Celulares": "📱", "Computadores": "💻", "Baterias": "🔋",
  "Cabos": "🔌", "Placas": "🖥️", "Monitores": "🖥️",
  "Periféricos": "🖱️", "Outros": "📦",
};

function SellerBadges({ product }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {product.seller_type === "Empresa" && (
        <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full">
          <Building2 className="w-2.5 h-2.5" /> Empresa
        </span>
      )}
      {product.verified && (
        <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full">
          <BadgeCheck className="w-2.5 h-2.5" /> Verificado
        </span>
      )}
      {product.high_demand && (
        <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded-full">
          <Flame className="w-2.5 h-2.5" /> Alta demanda
        </span>
      )}
    </div>
  );
}

export default function ProductCard({ product }) {
  const rating = product.seller_rating || 4.5;
  const stars = Math.round(rating);

  return (
    <Link to={`/negociacao/${product.id}`} className="block group">
      <div className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col">

        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-muted flex-shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">{MATERIAL_ICONS[product.material_type] || "📦"}</span>
              <span className="text-xs text-muted-foreground">{product.material_type}</span>
            </div>
          )}
          {/* Status pill */}
          <div className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[product.status] || statusColors["Disponível"]}`}>
            {product.status || "Disponível"}
          </div>
          {/* Material pill */}
          <div className="absolute top-2 left-2 text-[10px] font-medium bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {MATERIAL_ICONS[product.material_type]} {product.material_type}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Seller badges */}
          <SellerBadges product={product} />

          {/* Price */}
          <p className="font-space font-bold text-xl text-primary mt-2">
            R$ {(product.price || 0).toFixed(2)}
          </p>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {product.quantity} {product.unit || "kg"}
            </span>
            {product.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {product.location}
              </span>
            )}
          </div>

          {/* Seller + rating */}
          <div className="mt-auto pt-3 border-t mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium truncate max-w-[120px]">{product.seller_name}</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                ))}
                <span className="text-[10px] text-muted-foreground ml-1">{rating.toFixed(1)}</span>
              </div>
            </div>
            <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Ver mais
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}