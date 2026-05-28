import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, X, User, LogOut, Leaf, Zap, Map, MessageSquare, Trophy, ShoppingBag, Users, BarChart3, Home } from "lucide-react";
import { getLevelInfo } from "@/lib/levels";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Início",      path: "/",           icon: Home },
  { label: "Comunidade",  path: "/comunidade",  icon: Users },
  { label: "Impacto",     path: "/impacto",     icon: BarChart3 },
  { label: "Negociação",  path: "/negociacao",  icon: ShoppingBag },
  { label: "Mapa",        path: "/mapa",        icon: Map },
  { label: "Gamificação", path: "/gamificacao", icon: Trophy },
  { label: "Assistente",  path: "/assistente",  icon: Zap },
  { label: "Mensagens",   path: "/mensagens",   icon: MessageSquare },
];

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        const notifs = await base44.entities.Notification.filter({ user_email: me.email, read: false });
        setUnreadCount(notifs.length);
      }
    });
  }, [location.pathname]);

  const levelInfo = getLevelInfo(user?.points || 0);
  const displayName = user?.display_name || user?.full_name || "";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-white/60 shadow-lg shadow-black/5"
          : "bg-white/60 backdrop-blur-xl border-b border-white/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow-green"
            >
              <Leaf className="w-4.5 h-4.5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white animate-pulse-slow" />
            </motion.div>
            <span className="font-outfit font-bold text-xl tracking-tight">
              GO<span className="text-gradient">-ECO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-all ${active ? "text-primary" : "group-hover:scale-110"}`} />
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notifications */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/notificacoes" className="relative p-2.5 rounded-xl hover:bg-muted/60 transition-colors block">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted/60 transition-all"
                    >
                      <div className={`relative w-8 h-8 rounded-xl bg-gradient-to-br ${levelInfo.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {user.avatar_url
                          ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                          : displayName[0]?.toUpperCase() || "U"
                        }
                        <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">{levelInfo.badge}</span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-semibold leading-none">{displayName.split(" ")[0]}</p>
                        <p className="text-[10px] text-muted-foreground">{user.points || 0} pts</p>
                      </div>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card border-white/60 rounded-2xl p-1.5 shadow-card-lift">
                    <div className="px-3 py-2.5 rounded-xl bg-gradient-to-br from-primary/8 to-accent/5 mb-1">
                      <p className="font-outfit font-semibold text-sm">{displayName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{levelInfo.badge} {levelInfo.name} · {user.points || 0} pts</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="cursor-pointer rounded-xl flex items-center gap-2">
                        <User className="w-4 h-4" /> Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/qrcode" className="cursor-pointer rounded-xl flex items-center gap-2">
                        📱 QR Code
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => base44.auth.logout()}
                      className="text-destructive cursor-pointer rounded-xl flex items-center gap-2 focus:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                size="sm"
                className="rounded-xl btn-gradient font-medium shadow-glow-green"
                onClick={() => base44.auth.redirectToLogin()}
              >
                Entrar
              </Button>
            )}

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-xl hover:bg-muted/60 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5" /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5" /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-white/60 overflow-hidden bg-white/90 backdrop-blur-xl"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((link, i) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
