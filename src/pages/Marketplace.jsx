import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/marketplace/ProductCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import CreateProductModal from "@/components/marketplace/CreateProductModal";

const SUGGESTIONS = ["Baterias", "Placa mãe", "Celular", "Cabo USB", "Computador", "Monitor"];
const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
];

export default function Marketplace() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    material: "all", seller: "Todos", minPrice: "", maxPrice: "", verified: false
  });

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 100),
  });

  const filtered = products
    .filter((p) => {
      if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) &&
          !p.material_type?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.material !== "all" && p.material_type !== filters.material) return false;
      if (filters.seller !== "Todos" && p.seller_type !== filters.seller) return false;
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      if (filters.verified && !p.verified) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sort === "price_desc") return (b.price || 0) - (a.price || 0);
      return new Date(b.created_date) - new Date(a.created_date);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-space font-bold text-2xl">Negociação ♻️</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {products.length} anúncios disponíveis
          </p>
        </div>
        {user && (
          <Button className="rounded-xl gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" /> Anunciar
          </Button>
        )}
      </div>

      {/* Search + Sort bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar materiais..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 ring-primary/20 transition-all"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border rounded-xl px-3 py-2 bg-card outline-none focus:ring-2 ring-primary/20 hidden sm:block"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center gap-2 border rounded-xl px-3 py-2 text-sm bg-card"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Search suggestions */}
      {!search && (
        <div className="flex gap-2 flex-wrap mb-5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSearch(s)}
              className="text-xs bg-muted hover:bg-primary/10 hover:text-primary border rounded-full px-3 py-1 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Mobile filters */}
      {showMobileFilters && (
        <div className="lg:hidden mb-4">
          <MarketplaceFilters filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* 2-column layout */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">

        {/* Sidebar filters (desktop) */}
        <div className="hidden lg:block">
          <MarketplaceFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1 bg-card outline-none sm:hidden"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-card border rounded-2xl p-12 text-center">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-medium">Nenhum anúncio encontrado</p>
              <p className="text-sm text-muted-foreground mt-1">Tente outros filtros ou seja o primeiro a anunciar!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <CreateProductModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={user}
        onCreated={refetch}
      />
    </div>
  );
}