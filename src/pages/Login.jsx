import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Loader, Eye, EyeOff, Zap, Recycle, TreePine } from 'lucide-react';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 8 + 4,
  left: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.4 + 0.15,
}));

const FEATURES = [
  { icon: Recycle, text: "Recicle eletrônicos com pontos" },
  { icon: Zap, text: "Gamificação e recompensas" },
  { icon: TreePine, text: "Impacto ambiental real" },
];

export default function Login() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [featureIdx, setFeatureIdx] = useState(0);
  const { checkAppState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setFeatureIdx(p => (p + 1) % FEATURES.length), 3000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await base44.auth.login(email, password);
      } else {
        if (!name.trim()) { setError('Informe seu nome'); setLoading(false); return; }
        if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); setLoading(false); return; }
        await base44.auth.register(email, password, name);
      }
      await checkAppState();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full animate-blob blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-400/15 rounded-full animate-blob delay-1000 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-teal-400/15 rounded-full animate-blob delay-2000 blur-3xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(52,211,153,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-emerald-400"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: '-20px',
              opacity: p.opacity,
              animation: `particle-rise ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-16 py-14 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-glow-green animate-glow-pulse">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-outfit font-bold text-2xl text-white tracking-tight">
            GO<span className="text-emerald-400">-ECO</span>
          </span>
        </motion.div>

        {/* Main text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">Plataforma Eco-Sustentável</span>
            </div>
            <h1 className="font-outfit font-black text-5xl text-white leading-[1.1] mb-4">
              Recicle.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Ganhe pontos.
              </span>
              <br />
              Salve o planeta.
            </h1>
            <p className="text-emerald-200/70 text-lg leading-relaxed max-w-md">
              A plataforma que transforma o descarte de eletrônicos em recompensas e impacto ambiental real.
            </p>
          </motion.div>

          {/* Rotating feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 space-y-3"
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  animate={{
                    opacity: featureIdx === i ? 1 : 0.35,
                    x: featureIdx === i ? 0 : -8,
                    scale: featureIdx === i ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${featureIdx === i ? 'bg-emerald-400/20 border border-emerald-400/40' : 'bg-white/5'}`}>
                    <Icon className={`w-4.5 h-4.5 ${featureIdx === i ? 'text-emerald-400' : 'text-white/30'}`} />
                  </div>
                  <span className={`text-sm font-medium ${featureIdx === i ? 'text-white' : 'text-white/30'}`}>{f.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { value: "10K+", label: "Usuários" },
            { value: "50T", label: "E-lixo reciclado" },
            { value: "200+", label: "Ecopontos" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="font-outfit font-black text-2xl text-emerald-400">{s.value}</p>
              <p className="text-emerald-200/60 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-glow-green mb-3 animate-glow-pulse">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-outfit font-bold text-2xl text-white">GO-ECO</h1>
          </div>

          {/* Card */}
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            {/* Tabs */}
            <div className="flex bg-muted/60 rounded-2xl p-1 mb-7">
              {[
                { id: 'login', label: 'Entrar' },
                { id: 'register', label: 'Criar conta' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                    tab === t.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-sm" />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {tab === 'register' && (
                  <motion.div
                    key="name"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      required={tab === 'register'}
                      className="w-full px-4 py-3 rounded-xl border bg-white/80 text-sm outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60 mb-4"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border bg-white/80 text-sm outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-xl border bg-white/80 text-sm outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-sm text-destructive bg-destructive/8 border border-destructive/20 px-4 py-3 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 background-size-300 animate-gradient shadow-glow-green transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading
                  ? <><Loader className="w-4 h-4 animate-spin" /> Aguarde...</>
                  : tab === 'login' ? '✨ Entrar' : '🌱 Criar minha conta'
                }
              </motion.button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-5 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Dados salvos localmente no seu navegador
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
