import React from "react";
import { Home, TrendingUp, Users, Leaf, Recycle, Zap, TreePine, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
  { id: "recentes", label: "Recentes", icon: Home },
  { id: "populares", label: "Populares", icon: TrendingUp },
  { id: "seguindo", label: "Seguindo", icon: Users },
];

const categories = [
  { id: "reciclagem", label: "Reciclagem", icon: Recycle },
  { id: "energia", label: "Energia Limpa", icon: Zap },
  { id: "natureza", label: "Natureza", icon: TreePine },
  { id: "consumo", label: "Consumo Consciente", icon: Leaf },
  { id: "global", label: "Impacto Global", icon: Globe },
];

export default function LeftSidebar({ activeFilter, onFilterChange, activeCategory, onCategoryChange }) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card border rounded-2xl p-4">
        <div className="space-y-1">
          {filters.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onFilterChange(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                activeFilter === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card border rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categorias</p>
        <div className="space-y-1">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onCategoryChange(activeCategory === id ? null : id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                activeCategory === id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}