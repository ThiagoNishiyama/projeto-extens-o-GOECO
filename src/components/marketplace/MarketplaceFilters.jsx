import React from "react";
import { X } from "lucide-react";

const MATERIAL_TYPES = ["Celulares", "Computadores", "Baterias", "Cabos", "Placas", "Monitores", "Periféricos", "Outros"];
const SELLER_TYPES = ["Todos", "Pessoa Física", "Empresa"];

export default function MarketplaceFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  const hasActive = filters.material !== "all" || filters.seller !== "Todos" ||
    filters.minPrice || filters.maxPrice;

  const clearAll = () => onChange({ material: "all", seller: "Todos", minPrice: "", maxPrice: "", verified: false });

  return (
    <div className="bg-card border rounded-2xl p-4 space-y-5 sticky top-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filtros</h3>
        {hasActive && (
          <button onClick={clearAll} className="text-xs text-primary hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      {/* Material */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tipo de Material</p>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="material"
              checked={filters.material === "all"}
              onChange={() => set("material", "all")}
              className="accent-primary"
            />
            <span className="text-sm">Todos</span>
          </label>
          {MATERIAL_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="material"
                checked={filters.material === t}
                onChange={() => set("material", t)}
                className="accent-primary"
              />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Preço (R$)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set("minPrice", e.target.value)}
            className="w-full text-sm bg-muted rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-primary/20"
          />
          <span className="text-muted-foreground text-sm">—</span>
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice}
            onChange={(e) => set("maxPrice", e.target.value)}
            className="w-full text-sm bg-muted rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-primary/20"
          />
        </div>
      </div>

      {/* Seller type */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Vendedor</p>
        <div className="space-y-1.5">
          {SELLER_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="seller"
                checked={filters.seller === t}
                onChange={() => set("seller", t)}
                className="accent-primary"
              />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Verified only */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Outros</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => set("verified", e.target.checked)}
            className="accent-primary w-4 h-4"
          />
          <span className="text-sm">✅ Apenas verificados</span>
        </label>
      </div>
    </div>
  );
}