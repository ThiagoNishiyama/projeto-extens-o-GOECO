import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, MessageSquare, Users, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Messages() {
  const [user, setUser] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations", user?.email],
    queryFn: async () => {
      if (!user) return [];
      const all = await base44.entities.Conversation.list("-updated_date", 50);
      return all.filter((c) => c.participants?.includes(user.email));
    },
    enabled: !!user,
  });

  const loadMessages = async (conv) => {
    setSelectedConv(conv);
    setLoadingMessages(true);
    const msgs = await base44.entities.Message.filter({ conversation_id: conv.id }, "created_date", 100);
    setMessages(msgs);
    setLoadingMessages(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;
    await base44.entities.Message.create({
      conversation_id: selectedConv.id,
      sender_email: user.email,
      sender_name: user.full_name,
      content: newMessage,
    });
    await base44.entities.Conversation.update(selectedConv.id, {
      last_message: newMessage,
      last_message_date: new Date().toISOString(),
    });
    setNewMessage("");
    loadMessages(selectedConv);
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };

  const { data: follows = [] } = useQuery({
    queryKey: ["myFollows", user?.email],
    queryFn: async () => {
      if (!user) return [];
      const [following, followers] = await Promise.all([
        base44.entities.Follow.filter({ follower_email: user.email }),
        base44.entities.Follow.filter({ following_email: user.email }),
      ]);
      // Merge unique contacts not already in conversations
      const convEmails = new Set(conversations.flatMap((c) => c.participants || []));
      const seen = new Set();
      const contacts = [];
      for (const f of following) {
        if (!seen.has(f.following_email) && f.following_email !== user.email) {
          seen.add(f.following_email);
          contacts.push({ email: f.following_email, label: "Seguindo" });
        }
      }
      for (const f of followers) {
        if (!seen.has(f.follower_email) && f.follower_email !== user.email) {
          seen.add(f.follower_email);
          contacts.push({ email: f.follower_email, label: "Seguidor" });
        }
      }
      return contacts;
    },
    enabled: !!user,
  });

  const startNewConversation = async (email) => {
    // Check if conversation already exists
    const existing = conversations.find((c) => c.participants?.includes(email) && c.participants?.includes(user.email));
    if (existing) { loadMessages(existing); return; }
    // Fetch name
    const users = await base44.entities.User.filter({ email });
    const name = users[0]?.full_name || email.split("@")[0];
    const conv = await base44.entities.Conversation.create({
      participants: [user.email, email],
      participant_names: [user.full_name, name],
      last_message: "",
      last_message_date: new Date().toISOString(),
    });
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    loadMessages(conv);
  };

  const getOtherName = (conv) => {
    if (conv.is_group) return conv.group_name || "Grupo";
    const idx = conv.participants?.indexOf(user?.email);
    return conv.participant_names?.[idx === 0 ? 1 : 0] || "Usuário";
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Faça login para acessar suas mensagens</p>
        <Button className="mt-4" onClick={() => base44.auth.redirectToLogin()}>Entrar</Button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Conversation List */}
      <div className={`w-full md:w-80 lg:w-96 border-r bg-card flex flex-col ${selectedConv ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b">
          <h1 className="font-space font-bold text-lg">Mensagens</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Seguindo / Seguidores */}
          {follows.length > 0 && (
            <div className="p-3 border-b bg-muted/20">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Sua rede
              </p>
              <div className="flex flex-col gap-1">
                {follows.map((contact) => (
                  <button
                    key={contact.email}
                    onClick={() => startNewConversation(contact.email)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {contact.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{contact.email.split("@")[0]}</p>
                      <p className="text-[10px] text-muted-foreground">{contact.label}</p>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Nenhuma conversa ainda
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadMessages(conv)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b ${
                  selectedConv?.id === conv.id ? "bg-muted/50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {getOtherName(conv)?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-sm truncate">{getOtherName(conv)}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message || "..."}</p>
                </div>
                {conv.last_message_date && (
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(conv.last_message_date), { addSuffix: true, locale: ptBR })}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedConv ? "hidden md:flex" : "flex"}`}>
        {selectedConv ? (
          <>
            <div className="p-4 border-b flex items-center gap-3 bg-card">
              <button onClick={() => setSelectedConv(null)} className="md:hidden p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                {getOtherName(selectedConv)?.[0]}
              </div>
              <p className="font-medium text-sm">{getOtherName(selectedConv)}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Carregando...</div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_email === user.email;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}>
                        {!isMe && <p className="text-xs font-medium mb-1 opacity-70">{msg.sender_name}</p>}
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t bg-card flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite uma mensagem..."
                className="rounded-xl"
              />
              <Button type="submit" size="icon" className="rounded-xl flex-shrink-0" disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Selecione uma conversa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}