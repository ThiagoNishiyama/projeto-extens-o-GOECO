import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Send, Loader, Sparkles, RotateCcw, MapPin, AlertTriangle, Recycle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const QUICK_SUGGESTIONS = [
  "Celular quebrado", "Notebook antigo", "Pilhas usadas", "TV antiga",
  "Carregador velho", "Placa de vídeo", "Impressora", "Bateria de carro",
];

const POINT_TABLE = [
  { item: "Pilha / Bateria pequena", points: 10, co2: 0.05, category: "Bateria" },
  { item: "Carregador / Cabo", points: 15, co2: 0.1, category: "Acessório" },
  { item: "Celular / Smartphone", points: 50, co2: 0.5, category: "Smartphone" },
  { item: "Tablet", points: 60, co2: 0.6, category: "Tablet" },
  { item: "Notebook / Laptop", points: 100, co2: 1.2, category: "Computador" },
  { item: "Computador Desktop", points: 120, co2: 1.5, category: "Computador" },
  { item: "Monitor / TV até 32\"", points: 80, co2: 0.9, category: "Display" },
  { item: "TV / Monitor grande", points: 130, co2: 1.8, category: "Display" },
  { item: "Impressora / Scanner", points: 70, co2: 0.8, category: "Periférico" },
  { item: "Console de videogame", points: 90, co2: 1.0, category: "Entretenimento" },
];

export default function EcoAssistant() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("assistant");

  const handleAnalyze = async (query) => {
    const q = query || input;
    if (!q.trim()) return;
    setInput(q);
    setLoading(true);
    setResult(null);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é o Assistente de Descarte Sustentável do GO-ECO. O usuário quer descartar: "${q}"

Responda OBRIGATORIAMENTE neste formato JSON exato:
{
  "item_name": "nome do item identificado",
  "category": "categoria (Smartphone/Computador/Bateria/Acessório/Eletrodoméstico/Display/Periférico/Outro)",
  "risk_level": "Alto/Médio/Baixo",
  "risk_description": "descrição curta do risco ambiental em 1-2 frases",
  "how_to_discard": ["passo 1", "passo 2", "passo 3"],
  "materials": ["material 1", "material 2", "material 3"],
  "eco_tip": "dica ecológica curta e motivacional",
  "can_reuse": true/false,
  "reuse_suggestion": "sugestão de reutilização se aplicável"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          item_name: { type: "string" },
          category: { type: "string" },
          risk_level: { type: "string" },
          risk_description: { type: "string" },
          how_to_discard: { type: "array", items: { type: "string" } },
          materials: { type: "array", items: { type: "string" } },
          eco_tip: { type: "string" },
          can_reuse: { type: "boolean" },
          reuse_suggestion: { type: "string" },
        },
      },
    });

    // Find matching points
    const match = POINT_TABLE.find((p) =>
      p.category.toLowerCase() === response.category?.toLowerCase() ||
      p.item.toLowerCase().includes(q.toLowerCase()) ||
      q.toLowerCase().includes(p.category.toLowerCase())
    ) || POINT_TABLE[2]; // default to celular

    setResult({ ...response, estimated_points: match.points, estimated_co2: match.co2 });
    setLoading(false);
  };

  const riskColor = {
    Alto: "text-destructive bg-destructive/10 border-destructive/20",
    Médio: "text-yellow-600 bg-yellow-50 border-yellow-200",
    Baixo: "text-primary bg-primary/10 border-primary/20",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-space font-bold text-2xl mb-2">Assistente de Descarte Inteligente</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Informe o item eletrônico que deseja descartar e receba orientações personalizadas, 
          riscos ambientais e pontuação estimada.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 justify-center">
        {[
          { id: "assistant", label: "🤖 Assistente IA" },
          { id: "table", label: "📊 Tabela de Pontos" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border hover:border-primary/30 text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "assistant" && (
        <>
          {/* Input */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="Ex: celular quebrado, notebook antigo, pilhas..."
                  className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/20"
                />
                <Button onClick={() => handleAnalyze()} disabled={loading || !input.trim()} className="rounded-xl gap-2">
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Analisar
                </Button>
              </div>
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAnalyze(s)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground text-sm">Analisando item e gerando orientações...</p>
            </motion.div>
          )}

          {/* Result */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Header card */}
                <Card className="overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-space font-bold text-lg">{result.item_name}</h2>
                        <Badge variant="secondary" className="mt-1">{result.category}</Badge>
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${riskColor[result.risk_level] || riskColor["Médio"]}`}>
                        <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                        Risco {result.risk_level}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{result.risk_description}</p>

                    {/* Points & CO2 */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-primary/5 rounded-xl p-3 text-center">
                        <p className="font-space font-bold text-xl text-primary">+{result.estimated_points}</p>
                        <p className="text-xs text-muted-foreground">pontos estimados</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-3 text-center">
                        <p className="font-space font-bold text-xl text-emerald-600">{result.estimated_co2}kg</p>
                        <p className="text-xs text-muted-foreground">CO₂ evitado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* How to discard */}
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-space font-semibold text-sm flex items-center gap-2 mb-3">
                        <Recycle className="w-4 h-4 text-primary" /> Como Descartar
                      </h3>
                      <ol className="space-y-2">
                        {result.how_to_discard?.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  {/* Materials & Reuse */}
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-5">
                        <h3 className="font-space font-semibold text-sm flex items-center gap-2 mb-3">
                          <DollarSign className="w-4 h-4 text-accent" /> Materiais Recicláveis
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.materials?.map((m, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5">
                        <h3 className="font-space font-semibold text-sm flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-primary" /> Dica Eco
                        </h3>
                        <p className="text-sm text-muted-foreground">{result.eco_tip}</p>
                        {result.can_reuse && result.reuse_suggestion && (
                          <div className="mt-3 p-3 bg-primary/5 rounded-xl">
                            <p className="text-xs font-medium text-primary">💡 Pode reutilizar!</p>
                            <p className="text-xs text-muted-foreground mt-1">{result.reuse_suggestion}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Button variant="outline" className="w-full gap-2" onClick={() => { setResult(null); setInput(""); }}>
                  <RotateCcw className="w-4 h-4" /> Analisar outro item
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {activeTab === "table" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 font-space font-semibold text-xs text-muted-foreground">Item</th>
                    <th className="text-left px-4 py-3 font-space font-semibold text-xs text-muted-foreground">Categoria</th>
                    <th className="text-center px-4 py-3 font-space font-semibold text-xs text-muted-foreground">Pontos</th>
                    <th className="text-center px-4 py-3 font-space font-semibold text-xs text-muted-foreground">CO₂ Evitado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {POINT_TABLE.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium">{row.item}</td>
                      <td className="px-4 py-3"><Badge variant="secondary" className="text-xs">{row.category}</Badge></td>
                      <td className="px-4 py-3 text-center font-space font-bold text-primary">+{row.points}</td>
                      <td className="px-4 py-3 text-center text-emerald-600 font-medium">{row.co2}kg</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}