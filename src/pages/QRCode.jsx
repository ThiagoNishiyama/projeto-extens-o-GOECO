import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Smartphone, ArrowRight } from "lucide-react";
import { getLevelInfo } from "@/lib/levels";
import { motion } from "framer-motion";

export default function QRCodePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <QrCode className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Faça login para ver seu QR Code</p>
        <Button className="mt-4" onClick={() => base44.auth.redirectToLogin()}>Entrar</Button>
      </div>
    </div>
  );

  const levelInfo = getLevelInfo(user.points || 0);
  const qrData = btoa(JSON.stringify({ userId: user.id, email: user.email, name: user.full_name }));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=0B8457&bgcolor=FFFFFF`;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="font-space font-bold text-2xl mb-1">Seu QR Code</h1>
          <p className="text-sm text-muted-foreground">Apresente nos ecopontos para registrar descartes</p>
        </div>

        <Card className="overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${levelInfo.color}`} />
          <CardContent className="p-8 flex flex-col items-center">
            <div className="bg-white p-6 rounded-2xl shadow-inner mb-6">
              <img src={qrUrl} alt="QR Code" className="w-56 h-56" />
            </div>

            <div className="text-center mb-6">
              <p className="font-space font-bold text-lg">{user.full_name}</p>
              <Badge className={`mt-2 ${levelInfo.bgColor} ${levelInfo.textColor}`}>
                {levelInfo.badge} {levelInfo.name} • {user.points || 0} pts
              </Badge>
            </div>

            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={() => {
                const a = document.createElement("a");
                a.href = qrUrl;
                a.download = `go-eco-qrcode-${user.id}.png`;
                a.click();
              }}
            >
              <Download className="w-4 h-4" /> Baixar QR Code
            </Button>
          </CardContent>
        </Card>

        {/* How it works */}
        <div className="mt-8 space-y-4">
          <h2 className="font-space font-semibold text-lg text-center">Como funciona</h2>
          <div className="space-y-3">
            {[
              { step: 1, icon: Smartphone, text: "Abra seu QR Code no celular" },
              { step: 2, icon: QrCode, text: "Escaneie no ecoponto" },
              { step: 3, icon: ArrowRight, text: "Descarte seu lixo eletrônico" },
              { step: 4, text: "Receba pontos automaticamente!", icon: null },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 bg-card border rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}