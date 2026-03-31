import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart, MessageCircle, Trophy, ShoppingBag, Target, CheckCheck, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const typeIcons = {
  like: Heart,
  comment: MessageCircle,
  message: MessageCircle,
  points: Trophy,
  negotiation: ShoppingBag,
  challenge: Target,
  follow: UserPlus,
};

const typeColors = {
  like: "text-red-500 bg-red-50",
  comment: "text-blue-500 bg-blue-50",
  message: "text-primary bg-primary/10",
  points: "text-yellow-600 bg-yellow-50",
  negotiation: "text-purple-500 bg-purple-50",
  challenge: "text-emerald-500 bg-emerald-50",
  follow: "text-pink-500 bg-pink-50",
};

export default function Notifications() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.email],
    queryFn: () => base44.entities.Notification.filter({ user_email: user.email }, "-created_date", 50),
    enabled: !!user,
  });

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    for (const n of unread) {
      await base44.entities.Notification.update(n.id, { read: true });
    }
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markRead = async (notif) => {
    if (!notif.read) {
      await base44.entities.Notification.update(notif.id, { read: true });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Faça login para ver suas notificações</p>
        <Button className="mt-4" onClick={() => base44.auth.redirectToLogin()}>Entrar</Button>
      </div>
    </div>
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-space font-bold text-2xl mb-1">Notificações</h1>
          {unreadCount > 0 && <Badge className="bg-primary/10 text-primary">{unreadCount} não lidas</Badge>}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-2 text-sm">
            <CheckCheck className="w-4 h-4" /> Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Nenhuma notificação ainda</p>
            <p className="text-xs text-muted-foreground mt-1">Quando alguém curtir, comentar ou te seguir, aparecerá aqui.</p>
          </Card>
        ) : (
          notifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            const colors = typeColors[n.type] || "text-muted-foreground bg-muted";
            return (
              <Card
                key={n.id}
                className={`cursor-pointer transition-all hover:border-primary/20 ${!n.read ? "bg-primary/[0.02] border-primary/10" : ""}`}
                onClick={() => markRead(n)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    {n.created_date && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.created_date), { addSuffix: true, locale: ptBR })}
                      </p>
                    )}
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}