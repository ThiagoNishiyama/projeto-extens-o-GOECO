import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, X, Package } from "lucide-react";
import { toast } from "sonner";
import { getLevelInfo } from "@/lib/levels";

const MATERIAL_TYPES = ["Celulares", "Computadores", "Baterias", "Cabos", "Placas", "Monitores", "Periféricos", "Outros"];
const MATERIAL_ICONS = {
  "Celulares": "📱", "Computadores": "💻", "Baterias": "🔋",
  "Cabos": "🔌", "Placas": "🖥️", "Monitores": "🖥️",
  "Periféricos": "🖱️", "Outros": "📦",
};

export default function CreateProductModal({ open, onOpenChange, user, onCreated }) {
  const [form, setForm] = useState({
    title: "", description: "", material_type: "Outros",
    quantity: 1, unit: "kg", price: 0, location: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = preview

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const reset = () => {
    setForm({ title: "", description: "", material_type: "Outros", quantity: 1, unit: "kg", price: 0, location: "" });
    setImageFile(null);
    setImagePreview(null);
    setStep(1);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error("Informe o título");
    setLoading(true);
    let image_url = "";
    if (imageFile) {
      const res = await base44.integrations.Core.UploadFile({ file: imageFile });
      image_url = res.file_url;
    }
    await base44.entities.Product.create({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      image_url,
      seller_name: user.display_name || user.full_name,
      seller_email: user.email,
      seller_type: user.seller_type || "Pessoa Física",
      status: "Disponível",
    });
    setLoading(false);
    reset();
    onOpenChange(false);
    onCreated();
    toast.success("Anúncio publicado! 🎉");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-space text-lg">
            {step === 1 ? "📦 Criar Anúncio" : "👀 Preview do Anúncio"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <Label>Foto do produto</Label>
              {imagePreview ? (
                <div className="relative mt-2">
                  <img src={imagePreview} className="w-full h-48 object-cover rounded-xl" alt="Preview" />
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                  <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Clique para adicionar foto</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
              )}
            </div>

            <div>
              <Label>Título *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Lote de baterias de notebook usadas" className="mt-1" />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Estado do material, marca, modelo..." className="mt-1 resize-none" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tipo de Material</Label>
                <Select value={form.material_type} onValueChange={(v) => setForm({ ...form, material_type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MATERIAL_TYPES.map((t) => <SelectItem key={t} value={t}>{MATERIAL_ICONS[t]} {t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Unidade</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gramas">Gramas</SelectItem>
                    <SelectItem value="kg">Quilogramas</SelectItem>
                    <SelectItem value="toneladas">Toneladas</SelectItem>
                    <SelectItem value="unidades">Unidades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Quantidade</Label>
                <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="mt-1" min="0" />
              </div>
              <div>
                <Label>Preço (R$)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" min="0" step="0.01" />
              </div>
            </div>

            <div>
              <Label>Localização</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: São Paulo, SP" className="mt-1" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)} disabled={!form.title.trim()}>
                Ver Preview
              </Button>
              <Button onClick={handleCreate} disabled={loading || !form.title.trim()} className="flex-1 rounded-xl">
                {loading ? "Publicando..." : "Publicar Agora"}
              </Button>
            </div>
          </div>
        ) : (
          /* Preview */
          <div className="space-y-4">
            <div className="bg-card border rounded-2xl overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-52 object-cover" alt="" />
              ) : (
                <div className="w-full h-52 bg-muted flex items-center justify-center">
                  <span className="text-5xl">{MATERIAL_ICONS[form.material_type]}</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base">{form.title || "Título do anúncio"}</h3>
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">Disponível</span>
                </div>
                <p className="text-2xl font-space font-bold text-primary mt-1">
                  R$ {Number(form.price || 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
                <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                  <span>📦 {form.material_type}</span>
                  <span>⚖️ {form.quantity} {form.unit}</span>
                  {form.location && <span>📍 {form.location}</span>}
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>{user?.display_name || user?.full_name}</span>
                  <span className="text-primary font-medium">Vendedor verificado</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>
                Editar
              </Button>
              <Button onClick={handleCreate} disabled={loading} className="flex-1 rounded-xl">
                {loading ? "Publicando..." : "✅ Confirmar e Publicar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}