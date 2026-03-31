import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-space font-bold text-sm">GO</span>
              </div>
              <span className="font-space font-bold text-xl">GO-ECO</span>
            </div>
            <p className="text-sm text-background/60">
              Vencer com sustentabilidade. Uma iniciativa IFSP Campus Pirituba.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Plataforma</h4>
            <div className="space-y-2">
              <Link to="/comunidade" className="block text-sm text-background/60 hover:text-primary transition-colors">Comunidade</Link>
              <Link to="/negociacao" className="block text-sm text-background/60 hover:text-primary transition-colors">Negociação</Link>
              <Link to="/mapa" className="block text-sm text-background/60 hover:text-primary transition-colors">Mapa</Link>
              <Link to="/gamificacao" className="block text-sm text-background/60 hover:text-primary transition-colors">Gamificação</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Recursos</h4>
            <div className="space-y-2">
              <Link to="/qrcode" className="block text-sm text-background/60 hover:text-primary transition-colors">QR Code</Link>
              <Link to="/perfil" className="block text-sm text-background/60 hover:text-primary transition-colors">Perfil</Link>
              <Link to="/mensagens" className="block text-sm text-background/60 hover:text-primary transition-colors">Mensagens</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Social</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-background/60 hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="block text-sm text-background/60 hover:text-primary transition-colors">Twitter / X</a>
              <a href="#" className="block text-sm text-background/60 hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="block text-sm text-background/60 hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">© 2026 GO-ECO. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1 text-xs text-background/40">
            <Leaf className="w-3 h-3 text-primary" />
            Feito com 💚 por estudantes do IFSP
          </div>
        </div>
      </div>
    </footer>
  );
}