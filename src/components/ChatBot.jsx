import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Loader, Leaf, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Olá! 🌿 Sou o assistente GO-ECO. Como posso ajudá-lo com reciclagem, ecopontos ou nossa plataforma?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um assistente de suporte da plataforma GO-ECO, um marketplace sustentável de eletrônicos. Responda de forma amigável e útil em português.

Contexto sobre GO-ECO:
- Plataforma de reciclagem e negociação de eletrônicos usados
- Usuários ganham ecopontos por descartes e atividades
- Sistema de gamificação com níveis (Bronze, Prata, Ouro, Platina, Eco Master)
- Comunidade para compartilhar ações sustentáveis
- Mapa de pontos de coleta (Ecopontos)

Mensagem do usuário: ${input}

Responda de forma concisa, amigável e com emojis.`,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Desculpe, tive um problema. Tente novamente! 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.35 }}
            className="glass-card rounded-3xl shadow-2xl w-80 h-[420px] flex flex-col mb-4 overflow-hidden border-white/60"
          >
            {/* Header */}
            <div
              className="relative px-4 py-3.5 text-white flex items-center justify-between overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488, #0891b2)', backgroundSize: '200%', animation: 'gradient-shift 6s ease infinite' }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-sm">GO-ECO Bot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/80">Online agora</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-emerald-50/30 to-background">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Leaf className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-primary to-accent text-white rounded-br-sm shadow-sm"
                        : "bg-white border border-border/50 text-foreground rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/40 p-3 flex gap-2 bg-white/60 backdrop-blur-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Pergunte algo..."
                className="flex-1 bg-muted/60 border border-border/40 rounded-2xl px-3.5 py-2 text-sm outline-none focus:ring-2 ring-primary/20 focus:border-primary/40 transition-all"
              />
              <motion.button
                onClick={handleSend}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center disabled:opacity-40 shadow-sm flex-shrink-0"
              >
                {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-14 h-14 rounded-2xl text-white shadow-glow-green flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #22c55e, #0d9488)' }}
      >
        {/* Ping ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl bg-emerald-400/30 animate-ping-slow" />
        )}
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-6 h-6" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle className="w-6 h-6" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
